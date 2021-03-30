// -----------------------------------------------------------------------
// <copyright file="ModelPostFileRequestValidator.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Models
{
    using System.IO;
    using System.Text;
    using FluentValidation;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Domain;

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
            RuleFor(r => Path.GetExtension(r.NewFile.Name)).MinimumLength(3).WithMessage("The model filename must have an extension.");
            RuleFor(r => r).Must(r => ValidateFileExtension(r)).WithMessage("Only OBJ models are supported now.").WithName(nameof(ModelPostFileRequestValidator));
            RuleFor(r => r).Must(r => ValidateModel3dContents(r)).WithMessage("The uploaded model file is not valid.").WithName(nameof(ModelPostFileRequestValidator));
        }
        public bool ValidateFileExtension(PostFileRequest<Domain.Model3d, Dto.Model3d> request)
        {
            Model3dFormat format = MapFormatFromExtension(request.NewFile.Name);
            return format == Model3dFormat.OBJ;
        }

        /// <summary>
        /// Validate the contents of Model3d file.
        /// </summary>
        /// <param name="request">PostFileRequest.</param>
        /// <returns>true if valid.</returns>
        public bool ValidateModel3dContents(PostFileRequest<Domain.Model3d, Dto.Model3d> request)
        {
            Model3dFormat format = MapFormatFromExtension(request.NewFile.Name);
            switch (format)
            {
                case Model3dFormat.OBJ:
                    return ValidateModel3dOBJ(request.NewFile.Raw);

                default:
                    return false;
            }
        }

        /// <summary>
        /// Validate a Model3d OBJ file.
        /// </summary>
        /// <param name="raw">Byte content.</param>
        /// <returns>true if valid OBJ file.</returns>
        private bool ValidateModel3dOBJ(byte[] raw)
        {
            var contents = Encoding.Default.GetString(raw);

            // vertex present
            if (!contents.Contains("\nv "))
                return false;

            // face present
            if (!contents.Contains("\nf "))
                return false;

            return true;
        }

        /// <summary>
        /// Maps a file extension to a Model3dFormat enum.
        /// </summary>
        /// <param name="name">Filename to map.</param>
        /// <returns>Model3dFormat</returns>
        public static Model3dFormat MapFormatFromExtension(string name)
        {
            var extension = Path.GetExtension(name);
            switch (extension.ToUpper())
            {
                case ".OBJ":
                    return Model3dFormat.OBJ;
                case ".STL":
                    return Model3dFormat.STL;
                default:
                    return Model3dFormat.None;
            }
        }
    }
}
