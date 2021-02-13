// -----------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Settings
{
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared;
    using ModelRelief.Database;
    using ModelRelief.Features.Settings;

    using Newtonsoft.Json;

    /// <summary>
    /// Represents a controller to handle Settings API requests.
    /// </summary>
    // [Route("api/v1/[controller]")]
    public class SettingsController : RestController<Domain.Settings, Dto.Settings, Dto.Settings, Dto.Settings, Dto.PostFile>
    {
        public ISettingsManager SettingsManager { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="settingsManager">ISettingsManager</param>
        public SettingsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator, ISettingsManager settingsManager)
            : base(dbContext, loggerFactory, mediator)
        {
            SettingsManager = settingsManager ?? throw new System.ArgumentNullException(nameof(settingsManager));
        }

        /// <summary>
        /// Returns the JSON settings file by category (e.g. camera).
        /// </summary>
        /// <param name="settingsType">JSON settings file type (e.g. camera).</param>
        /// <returns>JSON settings file.</returns>
        [Route("api/v1/settings/type/{settingsType}")]
        [HttpGet]
        public ContentResult GetSettingsByType([FromRoute] string settingsType)
        {
            var settingsObject = this.SettingsManager.GetSettings(settingsType);
            var serializedContent = JsonConvert.SerializeObject(settingsObject, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            });

            return new ContentResult
            {
                ContentType = "application/json",
                Content = serializedContent,
            };
        }
    }
}
