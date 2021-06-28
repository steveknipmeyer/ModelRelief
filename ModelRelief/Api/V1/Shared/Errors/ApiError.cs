﻿// -----------------------------------------------------------------------
// <copyright file="ApiError.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    using System.Collections.Generic;

    /// <summary>
    /// JSON error status result returned by the API.
    /// </summary>
    public class ApiError
    {
        public int      HttpStatusCode { get; set; }
        public int      ApiErrorCode { get; set; }
        public string   DeveloperMessage { get; set; }
        public string   ApiReference { get; set; }
        public IEnumerable<ValidationError> Errors { get; set; }
    }
}