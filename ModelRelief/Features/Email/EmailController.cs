﻿// -----------------------------------------------------------------------
// <copyright file="EmailController.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Settings;
    using ModelRelief.Utility;
    using Newtonsoft.Json.Linq;

    public class EmailController : Controller
    {
        private IWebHostEnvironment HostingEnvironment { get; }
        private Services.IConfigurationProvider ConfigurationProvider { get; }
        private ILogger Logger { get; }
        private ReCAPTCHASettings ReCAPTCHASettings { get; }
        private IEmailService EmailService { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailController"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">IWebHostEnvironment.</param>
        /// <param name="configurationProvider">IConfigurationProvider.</param>
        /// <param name="loggerFactory">Logger factory.</param>
        /// <param name="reCAPTCHASettings">reCAPTCHA settings from a configuration store (Azure key vault).</param>
        /// <param name="emailService">Email service.</param>
        public EmailController(IWebHostEnvironment hostingEnvironment, Services.IConfigurationProvider configurationProvider, ILoggerFactory loggerFactory, IOptions<ReCAPTCHASettings> reCAPTCHASettings, IEmailService emailService)
        {
            HostingEnvironment = hostingEnvironment ?? throw new System.ArgumentNullException(nameof(hostingEnvironment));
            ConfigurationProvider = configurationProvider ?? throw new System.ArgumentNullException(nameof(configurationProvider));
            Logger = loggerFactory.CreateLogger<EmailController>();

            ReCAPTCHASettings = reCAPTCHASettings.Value as ReCAPTCHASettings;
            EmailService = emailService;
        }

        /// <summary>
        /// Checks the the reCAPTCHA results.
        /// </summary>
        /// <param name="gRecaptchaResponse">reCAPTCHA response from front-end form.</param>
        /// <param name="secret">Site secret.</param>
        /// <param name="logger">Logger.</param>
        /// <returns>True if passed.</returns>
        /// https://retifrav.github.io/blog/2017/08/23/dotnet-core-mvc-recaptcha/
        public static async  Task<bool> ReCaptchaPassed(string gRecaptchaResponse, string secret, ILogger logger)
        {
            HttpClient httpClient = new HttpClient();
            var result = await httpClient.GetAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={gRecaptchaResponse}");
            if (result.StatusCode != HttpStatusCode.OK)
            {
                logger.LogError("Error while sending request to ReCaptcha");
                return false;
            }

            string resultJSON = await result.Content.ReadAsStringAsync();
            dynamic dataJSON = JObject.Parse(resultJSON);
            if (dataJSON.success != "true")
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Action method for testing.
        /// </summary>
        [HttpGet]
        public IActionResult Test()
        {
            return Content("You have reached the Email controller.");
        }

        /// <summary>
        /// Action method for e-mail send.
        /// </summary>
        /// <param name="formData">Form contents from e-mail form.</param>
        [HttpPost]
        public async Task<JsonResult> Send([FromForm] EmailMessage formData)
        {
            bool requestIsLocal = HttpHelpers.RequestIsLocal(this.Request);
            string secretKey = requestIsLocal ? ReCAPTCHASettings.localhostModelRelief.Secret : ReCAPTCHASettings.ModelRelief.Secret;

            var reCapthaResponse = formData.ReCAPTCHAResponse;
            if (!await ReCaptchaPassed(reCapthaResponse, secretKey, Logger))
            {
                var errorResult = new { mailSent = false, message = "Please make sure you have checked 'I'm not a robot.'<br>The authorization validation failed. " };
                return Json(errorResult);
            }

            var name = formData.Name;
            var email = formData.Email;
            var newsletter = $"Newsletter: {formData.Newsletter}";

            var applicationList = (formData.Applications == null) ? string.Empty : string.Join(", ", formData.Applications);
            var applications = $"Applications: {applicationList}";
            if (!string.IsNullOrEmpty(formData.ApplicationOther))
            {
                var punctuation = applicationList.Length > 0 ? ", " : string.Empty;
                applications += $"{punctuation}{formData.ApplicationOther}";
            }

            var message = new EmailMessage
            {
                ToAddresses = new List<EmailAddress>() { new EmailAddress { Name = EmailService.Username, Address = EmailService.Username } },
                FromAddresses = new List<EmailAddress>() { new EmailAddress { Name = formData.Name, Address = formData.Email } },
                Subject = formData.Subject,

                Message = $"{name}\n{email}\n{newsletter}\n\n{formData.Message}\n\n{applications}",
            };

            var statusResult = EmailService.Send(message);
            if (!string.IsNullOrEmpty(statusResult))
            {
                var sendErrorResult = new { mailSent = false, message = $"Your e-mail could not be sent.<br><a href=\"mailto:info@modelrelief.org\">Please click here to use your mail client.</a><br>{statusResult}" };
                return Json(sendErrorResult);
            }

            var successResult = new { mailSent = true, message = "Your e-mail was successfully sent. Thank you!" };
            return Json(successResult);
        }
    }
}
