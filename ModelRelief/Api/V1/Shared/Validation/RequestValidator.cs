// -----------------------------------------------------------------------
// <copyright file="RequestValidator.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Validation
{
    using FluentValidation;
    using ModelRelief.Database;

    /// <summary>
    /// Abstract representation of a REST request validator.
    /// </summary>
    /// <typeparam name="TRequest">Request type to validate.</typeparam>
    public abstract class RequestValidator<TRequest> : AbstractValidator<TRequest>
    {
        public ModelReliefDbContext DbContext { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RequestValidator{TRequest}"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public RequestValidator(ModelReliefDbContext dbContext)
        {
            DbContext = dbContext;

            // N.B. Existence could be tested in validators if <all> requests, including Get and Delete requests, had FV validators defined.
            //      Currently, only requests that modify the database (PostRequest, PutRequest, PatchRequest) have validators defined.
            //      Also a specialized type of RequestValidator would be needed that used a generic type parameter (e.g. IExistingModelRequest)
            //      to ensure that the User and Id properties are present in the request.
        }
    }
}