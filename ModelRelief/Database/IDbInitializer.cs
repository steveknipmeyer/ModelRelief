// -----------------------------------------------------------------------
// <copyright file="IDbInitializer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Domain;
    using ModelRelief.Services;
    using ModelRelief.Settings;
    using ModelRelief.Utility;

    public interface IDbInitializer
    {
        IDbFactory DbFactory { get; set; }

        void Initialize();
    }
}