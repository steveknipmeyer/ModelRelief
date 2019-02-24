// -----------------------------------------------------------------------
// <copyright file="ServiceCollectionExtensions.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    using System;
    using System.Threading.Tasks;
    using FluentValidation.AspNetCore;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using ModelRelief.Database;
    using ModelRelief.Features.Email;
    using ModelRelief.Features.Errors;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services.Jobs;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Settings;

    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Extension method to conmfigure cookie policy.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        public static void ConfigureCookies(this IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
        }

        /// <summary>
        /// Extension to add support for Auth0.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        /// <param name="configuration">IConfiguration</param>
        public static void AddAuth0Authentication(this IServiceCollection services, IConfiguration configuration)
        {
            // Auth0 settings
            var auth0 = services.BuildServiceProvider().GetRequiredService<IOptions<Auth0Settings>>().Value as Auth0Settings;

            // Add authentication services
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddJwtBearer(options =>
            {
                options.Authority = $"https://{auth0.Domain}/";
                options.Audience = auth0.ApiAudience;
            })
            .AddOpenIdConnect("Auth0", options =>
            {
                // Set the authority to your Auth0 domain
                options.Authority = $"https://{auth0.Domain}";

                // Configure the Auth0 Client ID and Client Secret
                options.ClientId = auth0.ClientId;
                options.ClientSecret = auth0.ClientSecret;

                // Set response type to code
                options.ResponseType = "code";

                // Configure the scope
                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("email");

                // Set the correct name claim type
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                };

                // Set the callback path, so Auth0 will call back to http://localhost:5000/signin-auth0
                // Also ensure that you have added the URL as an Allowed Callback URL in your Auth0 dashboard
                options.CallbackPath = new PathString("/signin-auth0");

                // Configure the Claims Issuer to be Auth0
                options.ClaimsIssuer = "Auth0";

                options.Events = new OpenIdConnectEvents
                {
                    // handle the logout redirection
                    OnRedirectToIdentityProviderForSignOut = (context) =>
                    {
                        var logoutUri = $"https://{auth0.Domain}/v2/logout?client_id={auth0.ClientId}";

                        var postLogoutUri = context.Properties.RedirectUri;
                        if (!string.IsNullOrEmpty(postLogoutUri))
                        {
                            if (postLogoutUri.StartsWith("/"))
                            {
                                // transform to absolute
                                var request = context.Request;
                                postLogoutUri = request.Scheme + "://" + request.Host + request.PathBase + postLogoutUri;
                            }
                            logoutUri += $"&returnTo={Uri.EscapeDataString(postLogoutUri)}";
                        }

                        context.Response.Redirect(logoutUri);
                        context.HandleResponse();

                        return Task.CompletedTask;
                    },
                };
            });
        }

        /// <summary>
        /// Extension method to add the MVC services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        public static void AddCustomMvc(this IServiceCollection services)
        {
            services.AddMvc(options =>
            {
                options.InputFormatters.Insert(0, new RawRequestBodyFormatter());
                // N.B. Order matters!
                //                  options.Filters.Add(typeof(DbContextTransactionFilter));
                options.Filters.Add(typeof(GlobalExceptionFilter));
                //                  options.Filters.Add(typeof(ValidatorActionFilter));
            })
                .AddFeatureFolders()
                // automatically register all validators within this assembly
                .AddFluentValidation(config => { config.RegisterValidatorsFromAssemblyContaining<Startup>(); })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        /// <summary>
        /// Extension method to add ModelRelief services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        /// <param name="configuration">IConfiguration</param>
        public static void AddModelReliefServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<Services.IConfigurationProvider, Services.ConfigurationProvider>();
            services.AddSingleton<IStorageManager, StorageManager>();
            services.AddSingleton<IDependencyManager, DependencyManager>();
            services.AddSingleton<IDispatcher, Dispatcher>();

            services.AddTransient<IEmailService, EmailService>();
        }

        /// <summary>
        /// Extension method to add the database services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        /// <param name="env">IIHostingEnvironment</param>
        public static void AddDatabaseServices(this IServiceCollection services, IHostingEnvironment env)
        {
            // build the intermediate service provider
            var serviceProvider = services.BuildServiceProvider();
            var configurationProvider = serviceProvider.GetService<Services.IConfigurationProvider>() as ModelRelief.Services.ConfigurationProvider;

            switch (configurationProvider.Database)
            {
                case RelationalDatabaseProvider.SQLite:
                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlite(configurationProvider.Configuration.GetConnectionString(ConfigurationSettings.SQLite)));
                    break;

                case RelationalDatabaseProvider.SQLServer:
                default:
                    var connectionString = configurationProvider.Configuration.GetConnectionString(ConfigurationSettings.SQLServer);

                    // replace credentionals if production placeholder 'Credentials:SQLServer' present; NOT Trusted_Connection=True
                    var credentialSetting = ConfigurationSettings.CredentialsSQLServer;
                    connectionString = connectionString.Replace(credentialSetting, configurationProvider.GetSetting(credentialSetting));

                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlServer(connectionString));
                    break;
            }
        }

        /// <summary>
        /// Extension method to add strongly typed configuration settings.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        /// <param name="configuration">IConfiguration</param>
        public static void AddConfigurationTypes(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AccountsSettings>(configuration.GetSection("Accounts"));
            services.Configure<Auth0Settings>(configuration.GetSection("Auth0"));
            services.Configure<EmailSettings>(configuration.GetSection("EmailConfiguration"));

            /*
            // N.B. These strongly-typed configuration settings can be acquired in two ways in a controller.
            // https://arghya.xyz/articles/practical-configuration-and-di-in-aspnet-core/

            // A) Services (Indirect)
            public EmailController(IServiceProvider services)
            {
                var emailSettings = services.GetRequiredService<IOptions<EmailSettings>>().Value as EmailSettings;;
            }

            // B) Parameter (Direct)
            public EmailController(IOptions<EmailSettings> emailSettings)
            {
                var emailSettings = emailSettings.Value;
            }
            */
        }
    }
}
