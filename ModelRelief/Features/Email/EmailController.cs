// -----------------------------------------------------------------------
// <copyright file="EmailController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System;
    using System.Net;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;

    public class EmailController : Controller
        {
        private IHostingEnvironment HostingEnvironment { get; }
        private Services.IConfigurationProvider ConfigurationProvider { get; }
        private IEmailSettings EmailSettings { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailController"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="emailSettings">Email settings from a configuration store (Azure key vault).</param>
        public EmailController(IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, IOptions<EmailSettings> emailSettings)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            EmailSettings = emailSettings.Value;
        }

        /// <summary>
        /// Action method for e-mail send.
        /// </summary>
        /// <param name="formData">Form contents from e-mail form.</param>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Send([FromForm] EmailMessage formData)
        {
            var smtpUsername = EmailSettings.SmtpUsername;

            return new OkObjectResult($"Hello {formData.Name}");
        }
    }
}
