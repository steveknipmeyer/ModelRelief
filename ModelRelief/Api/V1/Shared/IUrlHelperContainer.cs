// -----------------------------------------------------------------------
// <copyright file="IUrlHelperContainer.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    using Microsoft.AspNetCore.Mvc;

    public interface IUrlHelperContainer
    {
        IUrlHelper Url { get; }
    }
}
