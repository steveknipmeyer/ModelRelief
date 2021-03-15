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
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Logging;
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

            this.UserSession = new Dto.Session();
            this.UserSettings = new Dto.Settings();
        }

        /// <summary>
        /// Get the user sessions for the active user.
        /// </summary>
        /// <param name="user">Active user</param>
        public Dto.Session InitializeUserSession(ClaimsPrincipal user)
        {
            // N.B. This method is called by _Layout to condition the UI menus.
            // As it is called outside the normal HTTP pipeline, the GlobalExceptionFilter cannot be used.
            // Special exception handling is required if the user is invalid.
            if ((user == null) || !user.Identity.IsAuthenticated)
                return this.UserSession;

            try
            {
                var applicationUser = IdentityUtility.FindApplicationUserAsync(user).GetAwaiter().GetResult();
                var userSession = DbContext.Session
                    .Where(s => (s.UserId == applicationUser.Id))
                    .SingleOrDefault<Domain.Session>();

                this.UserSession = this.Mapper.Map<Dto.Session>(userSession);

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
        public Dto.Settings InitializeUserSettings(ClaimsPrincipal user)
        {
            InitializeUserSession(user);
            if (this.UserSession.ProjectId == null)
                return this.UserSettings;

            // N.B. This method is called by _Layout to condition the UI menus.
            // As it is called outside the normal HTTP pipeline, the GlobalExceptionFilter cannot be used.
            // Special exception handling is required if the user is invalid.
            if ((user == null) || !user.Identity.IsAuthenticated)
                return this.UserSettings;

            try
            {
                var applicationUser = IdentityUtility.FindApplicationUserAsync(user).GetAwaiter().GetResult();
                var userSettingsQueryable = DbContext.Settings
                    .Where(s => (s.UserId == applicationUser.Id));

                if (this.UserSession.ProjectId != null)
                    userSettingsQueryable = userSettingsQueryable.Where(s => (s.Id == this.UserSession.ProjectId));

                var userSettings = userSettingsQueryable.SingleOrDefault<Domain.Settings>() ?? new Domain.Settings();

                this.UserSettings = this.Mapper.Map<Dto.Settings>(userSettings);

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
        public object GetSettings(string settingsType, ClaimsPrincipal user = null)
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
                    return InitializeUserSettings(user);

                case SettingsType.Session:
                    return InitializeUserSession(user);

                default:
                    return null;
            }
        }
    }
}
