﻿// -----------------------------------------------------------------------
// <copyright file="ReCAPTCHASettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// Represents Google reCAPTCHA keys in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class ReCAPTCHASettings
    {
        public ReCAPTCHAKeys ModelRelief { get; set; }
        public ReCAPTCHAKeys localhostModelRelief { get; set; }
    }
}