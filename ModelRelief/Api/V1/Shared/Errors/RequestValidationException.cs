// -----------------------------------------------------------------------
// <copyright file="RequestValidationException.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;
    using System.Collections.Generic;
    using FluentValidation;
    using FluentValidation.Results;

    /// <summary>
    ///  Represents an exception when a CQRS request is null.
    /// </summary>
    public class RequestValidationException : Exception
    {
        public Type RequestType { get; }
        public ValidationException ValidationException { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RequestValidationException"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="requestType">Request type.</param>
        /// <param name="validationFailures">Collection of validation errors.</param>
        public RequestValidationException(Type requestType, IEnumerable<ValidationFailure> validationFailures)
        {
            RequestType = requestType;
            ValidationException = new ValidationException(validationFailures);
        }
    }
}
