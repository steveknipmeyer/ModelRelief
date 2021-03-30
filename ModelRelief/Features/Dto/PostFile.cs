// -----------------------------------------------------------------------
// <copyright file="PostFile.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using FluentValidation;

    /// <summary>
    /// POST file model.
    /// </summary>
    public class PostFile
    {
        public string Name { get; set; }
        public byte[] Raw { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PostFile"/> class.
        /// Constructor
        /// </summary>
        public PostFile()
        {
        }
    }

    /// <summary>
    /// Validator for a PostFile object.
    /// </summary>
    public class PostFileValidator : AbstractValidator<Dto.PostFile>
    {
        public PostFileValidator()
        {
            RuleFor(m => m.Raw)
                .NotNull().WithMessage("An array of bytes is required.");
        }
    }
}
