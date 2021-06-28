// -----------------------------------------------------------------------
// <copyright file="MeshTransformPutRequestValidator.cs" company="ModelRelief">
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
    /// Represents a validator for a MeshTransform PutRequest.
    /// </summary>
    public class MeshTransformPutRequestValidator : RequestValidator<PutRequest<Domain.MeshTransform, Dto.MeshTransform, Dto.MeshTransform>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MeshTransformPutRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public MeshTransformPutRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new MeshTransformValidator());
        }
    }
}
