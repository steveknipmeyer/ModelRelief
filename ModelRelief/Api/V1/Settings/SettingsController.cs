﻿// -----------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Settings
{
    using System.Threading.Tasks;
    using AutoMapper;
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
    [Route("api/v1/[controller]")]
    public class SettingsController : RestController<Domain.Settings, Dto.Settings, Dto.Settings>
    {
        public ISettingsManager SettingsManager { get; }
        public IMapper Mapper { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">ISettingsManager</param>
        public SettingsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator, IMapper mapper, ISettingsManager settingsManager)
            : base(dbContext, loggerFactory, mediator)
        {
            Mapper = mapper ?? throw new System.ArgumentNullException(nameof(mapper));
            SettingsManager = settingsManager ?? throw new System.ArgumentNullException(nameof(settingsManager));
        }

        /// <summary>
        /// Returns the JSON settings for the default camera.
        /// </summary>
        /// <returns>JSON settings.</returns>
        [Route("camera")]
        [HttpGet]
        public IActionResult Camera()
        {
            var settingsObject = this.SettingsManager.GetSettings(SettingsType.Camera) as DefaultCameraSettingsJson;
            return Ok(settingsObject);
        }

        /// <summary>
        /// Returns the JSON settings for the user.
        /// </summary>
        /// <returns>JSON settings.</returns>
        [Route("user")]
        [HttpGet]
        [Produces("application/json")]
        public IActionResult UserSettings()
        {
            var settingsObject = this.SettingsManager.GetSettings(SettingsType.User, User) as Dto.Settings;
            return Ok(settingsObject);
        }
    }
}
