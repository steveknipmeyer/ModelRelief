// -----------------------------------------------------------------------
// <copyright file="IModelReferenceValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Validation
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using ModelRelief.Domain;
    public interface IModelReferenceValidator
    {
         Task Validate<TEntity>(TEntity model, ClaimsPrincipal claimsPrincipal)
            where TEntity : DomainModel;
   }
}
