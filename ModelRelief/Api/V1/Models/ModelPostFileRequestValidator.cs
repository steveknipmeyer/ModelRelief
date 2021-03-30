// -----------------------------------------------------------------------
// <copyright file="ModelPostFileRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Models
{
    using FluentValidation;
    using FluentValidation.Results;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a Model3d PostRequest.
    /// </summary>
    public class ModelPostFileRequestValidator : RequestValidator<PostFileRequest<Domain.Model3d, Dto.Model3d>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelPostFileRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public ModelPostFileRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(r => r).Must(r => ValidateModel3dContents(r)).WithMessage("The uploaded Model file is not valid.").WithName("File Contents");
        }

        public bool ValidateModel3dContents(PostFileRequest<Domain.Model3d, Dto.Model3d> request)
        {
            return true;
        }
    }
}
