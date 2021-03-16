// -----------------------------------------------------------------------
// <copyright file="SettingsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Settings
{
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Features.Settings;
    using ModelRelief.Services;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Settings Ux requests.
    /// </summary>
    public class SettingsController : ViewController<Domain.Settings, Dto.Settings, Dto.Settings>
    {
        public IWebHostEnvironment HostingEnvironment { get; set; }
        public Services.IConfigurationProvider ConfigurationProvider { get; set; }

        // Session key
        private const string SettingsEditReferringUrl = "SettingsEditReferringUrl";

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="settingsManager">Settings manager.</param>
        /// <param name="mediator">IMediator</param>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        public SettingsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, ISettingsManager settingsManager, IMediator mediator, IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider)
            : base(dbContext, loggerFactory, mapper, settingsManager, mediator)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
        }

        /// <summary>
        /// Action handler for an Edit Get.
        /// </summary>
        /// <param name="id">Model Id to edit.</param>
        /// <param name="queryParameters">Query parameters.</param>
        /// <returns>Edit page.</returns>
        [HttpGet]
        public override async Task<IActionResult> Edit(int id, [FromQuery] GetQueryParameters queryParameters)
        {
            HttpContext.Session.SetString(SettingsEditReferringUrl, this.Request.Headers["Referer"]);

            return await base.Edit(id, queryParameters);
        }

        /// <summary>
        /// Action handler for an Edit request.
        /// </summary>
        /// <param name="id">Id of model to edit.</param>
        /// <param name="postRequest">Edited model to update.</param>
        /// <returns>Edit page.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public override async Task<IActionResult> Edit(int id, Dto.Settings postRequest)
        {
            await base.Edit(id, postRequest);

            var redirectUrl = HttpContext.Session.GetString(SettingsEditReferringUrl) ?? "/";
            return this.Redirect(redirectUrl);
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="project">Project instance for View.</param>
        protected override async Task InitializeViewControlsAsync(Dto.Settings project = null)
        {
            await InitializeSessionAsync();

            ViewBag.Environment = HostingEnvironment.EnvironmentName;
            ViewBag.ASPNETCORE_URLS = ConfigurationProvider.GetSetting(ConfigurationSettings.URLS);
        }
    }
}
