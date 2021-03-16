// -----------------------------------------------------------------------
// <copyright file="ISettingsManager.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Features.Settings
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using ModelRelief.Dto;

    /// <summary>
    /// Interface for User settings.
    /// </summary>
    public interface ISettingsManager
    {
        Settings UserSettings { get; set; }
        Session UserSession { get; set; }
        Task<Settings> InitializeUserSettingsAsync(ClaimsPrincipal user);
        Task<Session> InitializeUserSessionAsync(ClaimsPrincipal user);
        Task<object> GetSettingsAsync(string settingsType, ClaimsPrincipal user = null);
    }
}
