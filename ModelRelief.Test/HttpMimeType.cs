// -----------------------------------------------------------------------
// <copyright file="HttpMimeType.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
