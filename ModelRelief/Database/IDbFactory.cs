// -----------------------------------------------------------------------
// <copyright file="IDbFactory.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
        Model3d AddModel3dRelated(ApplicationUser user, Model3d model, bool fileIsSynchronized);
        Project AddProjectRelated(ApplicationUser user, Project project);
        string GetEntityJSONFileName<TEntity>(string folderType);
        Task<List<ValidationFailure>> ValidateEntityAsync<TEntity>(ApplicationUser user)
                where TEntity : DomainModel;
        bool ValidateAll(ApplicationUser user);
    }
}
