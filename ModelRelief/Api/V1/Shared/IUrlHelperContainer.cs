// -----------------------------------------------------------------------
// <copyright file="IUrlHelperContainer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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
