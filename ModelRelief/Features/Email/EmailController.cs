// -----------------------------------------------------------------------
// <copyright file="EmailController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;
    using ModelRelief.Utility;

    public class EmailController : Controller
    {
        private IHostingEnvironment HostingEnvironment { get; }
        private Services.IConfigurationProvider ConfigurationProvider { get; }
        private ReCAPTCHASettings ReCAPTCHASettings { get; }
        private IEmailService EmailService { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailController"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="reCAPTCHASettings">reCAPTCHA settings from a configuration store (Azure key vault).</param>
        /// <param name="emailService">Email service.</param>
        public EmailController(IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, IOptions<ReCAPTCHASettings> reCAPTCHASettings, IEmailService emailService)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            ReCAPTCHASettings = reCAPTCHASettings.Value as ReCAPTCHASettings;
            EmailService = emailService;
        }

        /// <summary>
        /// Action method for e-mail send.
        /// </summary>
        /// <param name="formData">Form contents from e-mail form.</param>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Send([FromForm] EmailMessage formData)
        {
            bool requestIsLocal = HttpHelpers.RequestIsLocal(this.Request);
            var reCapthaResponse = Request.Form["g-recaptcha-response"];

            var message = new EmailMessage
            {
                Name = formData.Name,
                Email = formData.Email,
                Subject = formData.Subject,
                Message = formData.Message,

                ToAddresses = new List<EmailAddress>() { new EmailAddress { Name = EmailService.Username, Address = EmailService.Username } },
                FromAddresses = new List<EmailAddress>() { new EmailAddress { Name = formData.Name, Address = formData.Email } },
            };
            EmailService.Send(message);

            return new OkObjectResult(string.Empty);
        }
    }
}
