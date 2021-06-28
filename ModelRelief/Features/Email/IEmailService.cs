// -----------------------------------------------------------------------
// <copyright file="IEmailService.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Email
{
    using System.Collections.Generic;

    /// <summary>
    /// Represents an interface to an e-mail service.
    /// </summary>
    public interface IEmailService
    {
        string Username { get; }

        string Send(EmailMessage emailMessage);
        List<EmailMessage> ReceiveEmail(int maxCount = 10);
    }
}
