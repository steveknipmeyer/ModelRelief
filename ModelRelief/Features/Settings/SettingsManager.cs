// -----------------------------------------------------------------------
// <copyright file="SettingsManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    using System;
    using System.IO;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    /// <summary>
    /// Settings manager.
    /// </summary>
    public class SettingsManager : ISettingsManager
    {
        public Services.IConfigurationProvider ConfigurationProvider { get; set; }
        public Dto.Settings UserSettings { get; set; }
        public Dto.Session UserSession { get; set; }

        private  IWebHostEnvironment HostingEnvironment { get; set; }
        private IMapper _mapper { get; set; }
        private ILogger _logger { get; set; }
        private  ModelReliefDbContext _dbContext { get; set; }
        private IQuery _query { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsManager"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        /// <param name="dbContext">ModelReliefDBContext</param>
        /// <param name="query">IQuery</param>
        public SettingsManager(
            IWebHostEnvironment hostingEnvironment,
            Services.IConfigurationProvider configurationProvider,
            IMapper mapper,
            ILoggerFactory loggerFactory,
            ModelReliefDbContext dbContext,
            IQuery query)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            _mapper = mapper ?? throw new System.ArgumentNullException(nameof(mapper));
            _logger = (loggerFactory == null) ? throw new System.ArgumentNullException(nameof(loggerFactory)) : loggerFactory.CreateLogger(typeof(SettingsManager).Name);
            _dbContext = dbContext ?? throw new System.ArgumentNullException(nameof(dbContext));
            _query = query ?? throw new System.ArgumentNullException(nameof(query));

            UserSession = new Dto.Session();
            UserSettings = new Dto.Settings();
        }

        /// <summary>
        /// Get the user sessions for the active user.
        /// </summary>
        /// <param name="user">Active user</param>
        public async Task<Dto.Session> InitializeUserSessionAsync(ClaimsPrincipal user)
        {
            // N.B. This method is called by _Layout to condition the UI menus.
            // As it is called outside the normal HTTP pipeline, the GlobalExceptionFilter cannot be used.
            // Special exception handling is required if the user is invalid.
            if ((user == null) || !user.Identity.IsAuthenticated)
                return this.UserSession;

            try
            {
                var queryParameters = new GetQueryParameters() { Name = DbFactory.SettingsNames.Session };
                this.UserSession = await _query.FindDtoModelAsync<Domain.Session, Dto.Session>(user, id: 0, queryParameters);

                return this.UserSession;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to initialize user session for user {user.Identity.Name}: {ex.Message}");
                return this.UserSession;
            }
        }

        /// <summary>
        /// Assign the user settings from the active user (if defined)
        /// </summary>
        /// <param name="user">Active user</param>
        public async Task<Dto.Settings> InitializeUserSettingsAsync(ClaimsPrincipal user)
        {
            await InitializeUserSessionAsync(user);
            if ((this.UserSession.ProjectId == null) ||
               (this.UserSession.Project.Settings == null))
                return this.UserSettings;

            // N.B. This method is called by _Layout to condition the UI menus.
            // As it is called outside the normal HTTP pipeline, the GlobalExceptionFilter cannot be used.
            // Special exception handling is required if the user is invalid.
            if ((user == null) || !user.Identity.IsAuthenticated)
                return this.UserSettings;

            try
            {
                this.UserSettings = await this._query.FindDtoModelAsync<Domain.Settings, Dto.Settings>(user, this.UserSession.Project.SettingsId);

                return this.UserSettings;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to initialize user settings for user {user.Identity.Name}: {ex.Message}");
                return this.UserSettings;
            }
        }

        /// <summary>
        /// Return the default settings object for the given settings type.
        /// </summary>
        /// <param name="settingsType">Settings type (e.g. camera)</param>
        /// <param name="user">Active user</param>
        /// <returns>Settings object read from JSON.</returns>
        public async Task<object> GetSettingsAsync(string settingsType, ClaimsPrincipal user = null)
        {
            switch (settingsType.ToLower())
            {
                case SettingsType.Default:
                    var rootSettingsFile = Defaults.SettingsFile;
                    var settingsFile = $"{this.HostingEnvironment.ContentRootPath}{ConfigurationProvider.GetSetting(Paths.Settings)}/{rootSettingsFile}";
                    settingsFile = Path.GetFullPath(settingsFile);

                    dynamic defaultSettings = JsonConvert.DeserializeObject(System.IO.File.ReadAllText(settingsFile));
                    return defaultSettings;

                case SettingsType.User:
                    return await InitializeUserSettingsAsync(user);

                case SettingsType.Session:
                    return await InitializeUserSessionAsync(user);

                default:
                    return null;
            }
        }
    }
}
