// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using FluentValidation;
using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Errors
{
    /// <summary>
    ///  Represents an exception when a CQRS request is null.
    /// </summary>
    public class ApiValidationException : Exception
    {
        public Type RequestType { get; }
        public ValidationException ValidationException { get; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public ApiValidationException (Type requestType, IEnumerable<ValidationFailure> validationResult) 
        {
            RequestType = requestType;
            ValidationException = new ValidationException(validationResult);
        }
    }
}
