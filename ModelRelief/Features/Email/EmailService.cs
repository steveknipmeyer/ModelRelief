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

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailService"/> class.
        /// Constructor
        /// </summary>
        /// <param name="emailSettings">Email settings from a configuration store (Azure key vault).</param>
        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
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
        public void Send(EmailMessage emailMessage)
        {
            var message = new MimeMessage();
            message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
            message.From.AddRange(emailMessage.FromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.Subject = emailMessage.Subject;
            message.Body = new TextPart(TextFormat.Plain)
            {
                Text = emailMessage.Message,
            };

            using (var emailClient = new SmtpClient())
            {
                // ModelRelief.com does not (yet) have an SSL certification; SSL = false
                emailClient.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, false);

                //Remove any OAuth functionality as we won't be using it.
                emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                emailClient.Authenticate(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);

                emailClient.Send(message);

                emailClient.Disconnect(true);
            }
        }
    }
}
