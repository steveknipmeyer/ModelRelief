// -----------------------------------------------------------------------
// <copyright file="MeshTransformPostRequestValidator.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.MeshTransforms
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a MeshTransform PostRequest.
    /// </summary>
    public class MeshTransformPostRequestValidator : RequestValidator<PostRequest<Domain.MeshTransform, Dto.MeshTransform, Dto.MeshTransform>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformPostRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshTransformPostRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(r => r.NewModel).SetValidator(new MeshTransformValidator());
        }
    }
}
