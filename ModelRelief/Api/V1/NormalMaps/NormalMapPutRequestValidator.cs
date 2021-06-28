// -----------------------------------------------------------------------
// <copyright file="NormalMapPutRequestValidator.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.NormalMaps
{
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Api.V1.Shared.Validation;
    using ModelRelief.Database;
    using ModelRelief.Dto;

    /// <summary>
    /// Represents a validator for a NormalMap PutRequest.
    /// </summary>
    public class NormalMapPutRequestValidator : RequestValidator<PutRequest<Domain.NormalMap, Dto.NormalMap, Dto.NormalMap>>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMapPutRequestValidator"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public NormalMapPutRequestValidator(ModelReliefDbContext dbContext)
            : base(dbContext)
        {
            RuleFor(m => m.UpdatedModel).SetValidator(new NormalMapValidator());
        }
    }
}
