// -----------------------------------------------------------------------
// <copyright file="ApiValidationHelper.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Api.V1.Shared.Errors
{
    using System;
    using System.Linq;
    using Microsoft.AspNetCore.Http;

    /// <summary>
    /// Helper class to look up an ApiErrorCode based on the HTTP request and the domain model.
    /// </summary>
    public static class ApiValidationHelper
    {
        /// <summary>
        /// Map a domain model to an API status code base offset.
        /// </summary>
        /// <param name="domainModelType">Domain model type.</param>
        /// <returns>Base of status code.</returns>
        private static ErrorCodeBase MapDomainModelToStatusCodeBase(Type domainModelType)
        {
            // find base offset of domain model
            var baseOffset = ErrorCodeBase.Unknown;

            if (domainModelType == typeof(Domain.Camera))
                baseOffset = ErrorCodeBase.Camera;

            if (domainModelType == typeof(Domain.DepthBuffer))
                baseOffset = ErrorCodeBase.DepthBuffer;

            if (domainModelType == typeof(Domain.Mesh))
                baseOffset = ErrorCodeBase.Mesh;

            if (domainModelType == typeof(Domain.MeshTransform))
                baseOffset = ErrorCodeBase.MeshTransform;

            if (domainModelType == typeof(Domain.Model3d))
                baseOffset = ErrorCodeBase.Model3d;

            if (domainModelType == typeof(Domain.NormalMap))
                baseOffset = ErrorCodeBase.NormalMap;

            if (domainModelType == typeof(Domain.Project))
                baseOffset = ErrorCodeBase.Project;

            // no domain model match
            return baseOffset;
        }

        /// <summary>
        /// Map an HTTP request type to a status code offset from the base resource.
        /// </summary>
        /// <param name="requestType">HTTP request.</param>
        /// <returns>Offset of status code message from base.</returns>
        private static HttpRequestBaseOffset MapRequestTypeToBaseOffset(string requestType)
        {
            // now map HTTP request type to an offset
            var requestOffset = HttpRequestBaseOffset.Unknown;

            if (string.Equals(requestType, "GET", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Get;

            if (string.Equals(requestType, "POST", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Post;

            if (string.Equals(requestType, "PUT", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Put;

            if (string.Equals(requestType, "PATCH", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Patch;

            if (string.Equals(requestType, "DELETE", StringComparison.CurrentCultureIgnoreCase))
                requestOffset = HttpRequestBaseOffset.Delete;

            return requestOffset;
        }

        /// <summary>
        /// Returns an ApiErrorCode for a validation error given the HTTP request and the CQRS request type.
        /// </summary>
        /// <param name="httpRequest">HTTP request.</param>
        /// <param name="apiRequestType">CQRS request.</param>
        /// <returns>API error code in context of HTTP request</returns>
        public static ApiErrorCode MapRequestToApiErrorCode(HttpRequest httpRequest, Type apiRequestType)
        {
            // 1st generic type is the domain model
            Type domainModelType = apiRequestType.GenericTypeArguments?.FirstOrDefault();
            if (domainModelType == null)
                return ApiErrorCode.Default;

            var baseOffset = MapDomainModelToStatusCodeBase(domainModelType);

            // no domain model match; stop
            if (baseOffset == ErrorCodeBase.Unknown)
                return ApiErrorCode.Default;

            // now map HTTP request type to an offset
            var requestType = httpRequest.Method;
            var requestOffset = MapRequestTypeToBaseOffset(requestType);

            // no HTTP request type match; stop
            if (requestOffset == HttpRequestBaseOffset.Unknown)
                return ApiErrorCode.Default;

            var errorCode = (ApiErrorCode)((int)baseOffset + (int)requestOffset);
            return errorCode;
        }
    }
}