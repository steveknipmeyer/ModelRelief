// -----------------------------------------------------------------------
// <copyright file="HttpMimeType.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Test
{
    using System.Net.Mime;

    /// <summary>
    /// HTTP mime types.
    /// </summary>
    public static class HttpMimeType
    {
        public  const string Json = MediaTypeNames.Application.Json;
        public const string OctetStream = MediaTypeNames.Application.Octet;
        public const string MultiPartFormData = "multipart/form-data";
    }
}
