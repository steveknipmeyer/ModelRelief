// -----------------------------------------------------------------------
// <copyright file="RawRequestBodyFormatter.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Infrastructure
{
    using System;
    using System.IO;
    using System.Net.Mime;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc.Formatters;
    using Microsoft.Net.Http.Headers;

    /// <summary>
    /// Formatter that allows content of type text/plain and application/octet stream
    /// or no content type to be parsed to raw data. Allows for a single input parameter in the form of:
    ///
    /// public string RawString([FromBody] string data)
    /// public byte[] RawData([FromBody] byte[] data)
    /// </summary>
    public class RawRequestBodyFormatter : InputFormatter
    {
        public RawRequestBodyFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue(MediaTypeNames.Text.Plain));
            SupportedMediaTypes.Add(new MediaTypeHeaderValue(MediaTypeNames.Application.Octet));
        }

        /// <summary>
        /// Allow text/plain, application/octet-stream and no content type to be processed
        /// </summary>
        /// <param name="context">InputFormatterContext</param>
        public override bool CanRead(InputFormatterContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            var contentType = context.HttpContext.Request.ContentType;
            if (string.IsNullOrEmpty(contentType) ||
                contentType == MediaTypeNames.Text.Plain ||
                contentType == MediaTypeNames.Application.Octet)
                return true;

            return false;
        }

        /// <summary>
        /// Handle text/plain or no content type for string results
        /// Handle application/octet-stream for byte[] results
        /// </summary>
        /// <param name="context">InputFormatterContext</param>
        public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context)
        {
            var request     = context.HttpContext.Request;
            var contentType = context.HttpContext.Request.ContentType;

            if (contentType == MediaTypeNames.Text.Plain ||
                string.IsNullOrEmpty(contentType))
            {
                using (var reader = new StreamReader(request.Body))
                {
                    string content = await reader.ReadToEndAsync();
                    return await InputFormatterResult.SuccessAsync(content);
                }
            }

            if (contentType == MediaTypeNames.Application.Octet)
            {
                using (var ms = new MemoryStream(2048))
                {
                    await request.Body.CopyToAsync(ms);
                    byte[] content = ms.ToArray();
                    return await InputFormatterResult.SuccessAsync(content);
                }
            }

            return await InputFormatterResult.FailureAsync();
        }
    }
}