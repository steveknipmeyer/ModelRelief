// -----------------------------------------------------------------------
// <copyright file="SettingsManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;
    using ModelRelief.Services;
    using ModelRelief.Utility;
    using Newtonsoft.Json;

    /// <summary>
    /// Shared settings manager.
    /// Provides initialization of settings shared between the front end (FE) and backend (BE) through JSON.
    /// </summary>
    public class SettingsManager : ISettingsManager
    {
        private  IWebHostEnvironment HostingEnvironment { get; set; }
        public  Services.IConfigurationProvider ConfigurationProvider { get; set; }
        private IMapper Mapper { get; set; }
        private ILogger Logger { get; set; }
        private  ModelReliefDbContext DbContext { get; set; }

        private Query Query { get; set; }

        public Dto.Settings UserSettings { get; set; }
        public Dto.Session UserSession { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsManager"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        /// <param name="dbContext">ModelReliefDBContext</param>
        public SettingsManager(IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, IMapper mapper, ILoggerFactory loggerFactory, ModelReliefDbContext dbContext)
        {
            this.HostingEnvironment = hostingEnvironment;
            this.ConfigurationProvider = configurationProvider;
            this.Mapper = mapper;
            this.Logger = loggerFactory.CreateLogger<SettingsManager>();
            this.DbContext = dbContext;

            this.Query = new Query(DbContext, loggerFactory, Mapper);

            this.UserSession = new Dto.Session();
            this.UserSettings = new Dto.Settings();
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
                var queryParameters = new GetQueryParameters() { Name = "Session" };
                this.UserSession = await Query.FindModelAsync<Domain.Session, Dto.Session>(user, id: 0, queryParameters);

                return this.UserSession;
            }
            catch (Exception ex)
            {
                Logger.LogError($"Unable to initialize user session for user {user.Identity.Name}: {ex.Message}");
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
                var settingsId = this.UserSession.Project.SettingsId ?? 0;
                var queryParameters = new GetQueryParameters() { Relations = "Projects" };
                this.UserSettings = await this.Query.FindModelAsync<Domain.Settings, Dto.Settings>(user, settingsId, queryParameters);

                return this.UserSettings;
            }
            catch (Exception ex)
            {
                Logger.LogError($"Unable to initialize user settings for user {user.Identity.Name}: {ex.Message}");
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
                case SettingsType.Camera:
                    var rootSettingsFile = $"{Strings.Captitalize(settingsType)}Settings.json";
                    var settingsFile = $"{this.HostingEnvironment.ContentRootPath}{ConfigurationProvider.GetSetting(Paths.Settings)}/{rootSettingsFile}";
                    settingsFile = Path.GetFullPath(settingsFile);

                    var defaultCameraSettings = JsonConvert.DeserializeObject<DefaultCameraSettingsJson>(System.IO.File.ReadAllText(settingsFile));
                    return defaultCameraSettings;

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
