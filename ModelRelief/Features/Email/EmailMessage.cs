﻿// -----------------------------------------------------------------------
// <copyright file="EmailMessage.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System.Collections.Generic;

    /// <summary>
    /// Represents an e-mail message.
    /// </summary>
    public class EmailMessage
    {
        public EmailMessage()
        {
            ToAddresses = new List<EmailAddress>();
            FromAddresses = new List<EmailAddress>();
        }

        public List<EmailAddress> ToAddresses { get; set; }
        public List<EmailAddress> FromAddresses { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public bool Newsletter { get; set; }

        public string[] Applications { get; set; }
        public string ApplicationOther { get; set; }

        public string ReCAPTCHAResponse { get; set; }
    }
}
