﻿// -----------------------------------------------------------------------
// <copyright file="AccountsSettings.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Settings
{
    /// <summary>
    /// Represents test accounts in a configuration provider such as Azure Key Vault.
    /// </summary>
    public class AccountsSettings
    {
        public Account Development { get; set; }
        public Account Sales { get; set; }
        public Account Support { get; set; }
    }
}
