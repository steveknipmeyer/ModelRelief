// -----------------------------------------------------------------------
// <copyright file="Settings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System.IO;

    /// <summary>
    /// General settings.
    /// </summary>
    public class Settings
    {
        // N.B. Ideally, this would be provided by the runtime however that requires an instance of the IHostingEnvironment.
        // WIP: How can an instance of the IHostingEnvironment be efficiently constructed <outside> a controller so that
        // it can be accessed by general classes (e.g FileDomainModel)?
        public const string WebRoot   = "wwwroot";
        public const string StoreRoot = "store";
    }
}
