// -----------------------------------------------------------------------
// <copyright file="ISettingsManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features.Settings
{
    using System.Security.Claims;
    using ModelRelief.Domain;

    /// <summary>
    /// Interface for User settings.
    /// </summary>
    public interface ISettingsManager
    {
        Settings UserSettings { get; set; }
        void InitializeUserSettingsFromUser(ClaimsPrincipal user);
        object GetSettings(string settingsType);
    }
}
