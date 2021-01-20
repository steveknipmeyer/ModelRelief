// -----------------------------------------------------------------------
// <copyright file="ApplicationServices.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    /// <summary>
    /// Application service manager.
    /// Provides service instances to contexts where DI is not available.
    /// Classes outside controllers (e.g. FileDomain) do not have convenient access to DependencyInjection.
    /// </summary>
    public static class ApplicationServices
    {
        public static IStorageManager StorageManager { get; set; }
    }
}
