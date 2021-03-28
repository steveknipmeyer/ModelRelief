// -----------------------------------------------------------------------
// <copyright file="IDbFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using FluentValidation.Results;
    using ModelRelief.Domain;
    using ModelRelief.Settings;

    public interface IDbFactory
    {
        string SqlitePath { get; set; }

        ApplicationUser ConstructUserFromAccount(Account account);
        void InitializeUserStore();
        void SynchronizeTestDatabase(bool restore);
        Task SeedDatabaseForTestUsersAsync();
        Task SeedDatabaseForNewUserAsync(ClaimsPrincipal claimsPrincipal);
        Model3d AddModel3dRelated(ApplicationUser user, Model3d model);
        string GetEntityJSONFileName<TEntity>(string folderType);
        Task<List<ValidationFailure>> ValidateEntityAsync<TEntity>(ApplicationUser user)
                where TEntity : DomainModel;
        bool ValidateAll(ApplicationUser user);
    }
}
