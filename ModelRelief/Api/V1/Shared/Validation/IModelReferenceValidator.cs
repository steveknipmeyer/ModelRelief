// -----------------------------------------------------------------------
// <copyright file="IModelReferenceValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Validation
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using FluentValidation.Results;
    using ModelRelief.Domain;
    public interface IModelReferenceValidator
    {
        Task<List<ValidationFailure>> ValidateAsync<TEntity>(TEntity model, ClaimsPrincipal claimsPrincipalbool, bool throwIfError = true)
            where TEntity : DomainModel;
   }
}
