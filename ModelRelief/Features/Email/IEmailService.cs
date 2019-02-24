// -----------------------------------------------------------------------
// <copyright file="IEmailService.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Represents an interface to an e-mail service.
    /// </summary>
    public interface IEmailService
    {
        string Username { get; }

        void Send(EmailMessage emailMessage);
        List<EmailMessage> ReceiveEmail(int maxCount = 10);
    }
}
