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
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.IdentityModel.Tokens;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Features.Email;
    using ModelRelief.Features.Errors;
    using ModelRelief.Features.Settings;
    using ModelRelief.Infrastructure;
    using ModelRelief.Services.Jobs;
    using ModelRelief.Services.Relationships;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using Newtonsoft.Json;
    using OdeToCode.AddFeatureFolders;

    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Extension method to configure cookie policy.
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
            var auth0 = new Auth0Settings();
            configuration.GetSection("Auth0").Bind(auth0);

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
            var featureFolderOptions = new FeatureFolderOptions();
            services.AddControllersWithViews(options =>
                {
                    featureFolderOptions.FeatureFolderName = "Features";
                    options.Conventions.Add(new FeatureControllerModelConvention(featureFolderOptions));

                    options.InputFormatters.Insert(0, new RawRequestBodyFormatter());

                    // N.B. Order matters!
                    // options.Filters.Add(typeof(DbContextTransactionFilter));
                    options.Filters.Add(typeof(GlobalExceptionFilter));
                    // options.Filters.Add(typeof(ValidatorActionFilter));
                })
                .AddRazorOptions(o =>
                {
                    o.ViewLocationFormats.Clear();
                    o.ViewLocationFormats.Add(featureFolderOptions.FeatureNamePlaceholder + "/{0}.cshtml");
                    o.ViewLocationFormats.Add(featureFolderOptions.FeatureFolderName + "/Shared/{0}.cshtml");
                    o.ViewLocationFormats.Add(featureFolderOptions.DefaultViewLocation);

                    var expander = new FeatureViewLocationExpander(featureFolderOptions);
                    o.ViewLocationExpanders.Add(expander);
                })
                // automatically register all validators within this assembly
                .AddFluentValidation(config =>
                {
                    config.RegisterValidatorsFromAssemblyContaining<Startup>();
                })
                // disable .NET Core System.Text.Json in middleware
                .AddNewtonsoftJson(opt =>
                {
                    opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });
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

            // match DbContext (Scoped) as SettingsManager holds a reference
            services.AddScoped<ISettingsManager, SettingsManager>();

            services.AddTransient<IDependencyManager, DependencyManager>();
            services.AddTransient<IDispatcher, Dispatcher>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IModelReferenceValidator, ModelReferenceValidator>();
            services.AddTransient<IInitializer, Initializer>();
            services.AddTransient<IDbInitializer, DbInitializer>();
            services.AddTransient<IDbFactory, DbFactory>();
            services.AddTransient<IQuery, Query>();
        }

        /// <summary>
        /// Extension method to add the database services.
        /// </summary>
        /// <param name="services">IServiceCollection</param>
        /// <param name="configuration">IConfiguration</param>
        /// <param name="env">IWebHostEnvironment</param>
        public static void AddDatabaseServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment env)
        {
            var databaseProvider = Services.ConfigurationProvider.DatabaseFromSetting(configuration[ConfigurationSettings.MRDatabaseProvider]);

            switch (databaseProvider)
            {
                case RelationalDatabaseProvider.SQLite:
                default:
                    services.AddDbContext<ModelReliefDbContext>(options => options.UseSqlite(configuration.GetConnectionString(ConfigurationSettings.SQLite)));
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
            services.Configure<ReCAPTCHASettings>(configuration.GetSection("ReCAPTCHA"));
        }
    }
}
