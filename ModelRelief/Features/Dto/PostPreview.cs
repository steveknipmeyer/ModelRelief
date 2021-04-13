// -----------------------------------------------------------------------
// <copyright file="PostPreview.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using FluentValidation;

    /// <summary>
    /// POST preview image.
    /// </summary>
    public class PostPreview
    {
        public string Name { get; set; }
        public byte[] Raw { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PostPreview"/> class.
        /// Constructor
        /// </summary>
        public PostPreview()
        {
        }
    }

    /// <summary>
    /// Validator for a PostPreview object.
    /// </summary>
    public class PostPreviewValidator : AbstractValidator<Dto.PostPreview>
    {
        public PostPreviewValidator()
        {
            RuleFor(m => m.Raw)
                .NotNull().WithMessage("No preview content was provided.");
        }
    }
}
