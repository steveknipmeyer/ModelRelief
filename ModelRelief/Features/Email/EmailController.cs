﻿// -----------------------------------------------------------------------
// <copyright file="EmailController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using Newtonsoft.Json.Linq;

    public class EmailController : Controller
    {
        private IHostingEnvironment HostingEnvironment { get; }
        private Services.IConfigurationProvider ConfigurationProvider { get; }
        private ILogger Logger  { get; }
        private ReCAPTCHASettings ReCAPTCHASettings { get; }
        private IEmailService EmailService { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailController"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">IHostingEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="loggerFactory">Logger factory.</param>
        /// <param name="reCAPTCHASettings">reCAPTCHA settings from a configuration store (Azure key vault).</param>
        /// <param name="emailService">Email service.</param>
        public EmailController(IHostingEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, ILoggerFactory loggerFactory, IOptions<ReCAPTCHASettings> reCAPTCHASettings, IEmailService emailService)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            Logger = loggerFactory.CreateLogger<EmailController>();

            ReCAPTCHASettings = reCAPTCHASettings.Value as ReCAPTCHASettings;
            EmailService = emailService;
        }

        // A function that checks reCAPTCHA results
        // You might want to move it to some common class

        /// <summary>
        /// Checks the the reCAPTCHA results.
        /// </summary>
        /// <param name="gRecaptchaResponse">reCAPTCHA response from front-end form.</param>
        /// <param name="secret">Site secret.</param>
        /// <param name="logger">Logger.</param>
        /// <returns>True if passed.</returns>
        /// https://retifrav.github.io/blog/2017/08/23/dotnet-core-mvc-recaptcha/
        public static bool ReCaptchaPassed(string gRecaptchaResponse, string secret, ILogger logger)
        {
            HttpClient httpClient = new HttpClient();
            var result = httpClient.GetAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={gRecaptchaResponse}").Result;
            if (result.StatusCode != HttpStatusCode.OK)
            {
                logger.LogError("Error while sending request to ReCaptcha");
                return false;
            }

            string resultJSON = result.Content.ReadAsStringAsync().Result;
            dynamic dataJSON = JObject.Parse(resultJSON);
            if (dataJSON.success != "true")
            {
                return false;
            }

            return true;
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
            string secretKey = requestIsLocal ? ReCAPTCHASettings.localhostModelRelief.Secret : ReCAPTCHASettings.ModelRelief.Secret;

            var reCapthaResponse = Request.Form["g-recaptcha-response"];
            if (!ReCaptchaPassed(reCapthaResponse, secretKey, Logger))
                return StatusCode(StatusCodes.Status401Unauthorized);

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
