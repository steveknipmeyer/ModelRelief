// -----------------------------------------------------------------------
// <copyright file="Model3dFormFile.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.ComponentModel.DataAnnotations;
    using FluentValidation;
    using Microsoft.AspNetCore.Http;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for a Model3d with an enclosed POST file.
    /// </summary>
    public class Model3dFormFile : Model3d
    {
        public IFormFile FormFile { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Model3dFormFile"/> class.
        /// Constructor.
        /// </summary>
        public Model3dFormFile()
        {
        }
    }

    /// <summary>
    /// FV validator to support Views and model-binding validation.
    /// </summary>
    public class Model3dFormFileValidator : AbstractValidator<Model3dFormFile>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Model3dFormFileValidator"/> class.
        /// Constructor.
        /// </summary>
        public Model3dFormFileValidator()
        {
            RuleFor(m => m.Name)
                .NotNull().WithMessage("The Name property must be defined.");

            RuleFor(m => m.Description)
                .NotNull().WithMessage("The Description property is required.")
                .MinimumLength(3).WithMessage("The Description must be three or more characters.");
        }
    }
}
