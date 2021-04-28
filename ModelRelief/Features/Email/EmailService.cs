// -----------------------------------------------------------------------
// <copyright file="EmailService.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using MailKit.Net.Smtp;
    using MailKit.Security;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using MimeKit;
    using MimeKit.Text;
    using ModelRelief.Settings;

    /// <summary>
    /// Represents and e-mail service.
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly IEmailSettings _emailSettings;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailService"/> class.
        /// Constructor
        /// </summary>
        /// <param name="emailSettings">Email settings from a configuration store (Azure key vault).</param>
        /// <param name="loggerFactory">ILoggerFactory.</param>
        public EmailService(IOptions<EmailSettings> emailSettings, ILoggerFactory loggerFactory)
        {
            _emailSettings = emailSettings.Value;
            _logger = loggerFactory.CreateLogger(typeof(EmailService).Name);
        }

        /// <summary>
        /// Gets the e-mail username the services uses to send e-mail.
        /// </summary>
        public string Username
        {
            get { return _emailSettings.SmtpUsername; }
        }

        /// <summary>
        /// Receive e-mail.
        /// </summary>
        /// <param name="maxCount">Maximum number of messages to receive.</param>
        public List<EmailMessage> ReceiveEmail(int maxCount = 10)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Send an e-mail message.
        /// </summary>
        /// <param name="emailMessage">Message to send.</param>
        /// https://dotnetcoretutorials.com/2017/11/02/using-mailkit-send-receive-email-asp-net-core/
        public string Send(EmailMessage emailMessage)
        {
            var message = new MimeMessage();

            // e-mail must originate from a known domain account
            message.From.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
            message.ReplyTo.AddRange(emailMessage.FromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.Subject = emailMessage.Subject;
            message.Body = new TextPart(TextFormat.Plain)
            {
                Text = emailMessage.Message,
            };

            using (var emailClient = new SmtpClient())
            {
                try
                {
                    //accept all SSL certificates
                    emailClient.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
                    emailClient.Timeout = 15 * 1000;

                    emailClient.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.SslOnConnect);

                    // Remove any OAuth functionality as we won't be using it.
                    emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                    emailClient.Authenticate(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);

                    emailClient.Send(message);

                    emailClient.Disconnect(true);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"EmailService: {ex.Message}");
                    return ex.Message;
                }
            }
            return string.Empty;
        }
    }
}
