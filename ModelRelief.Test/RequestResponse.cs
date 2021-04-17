// -----------------------------------------------------------------------
// <copyright file="RequestResponse.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.Net.Http;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents the result of a client request.
    /// </summary>
    public class RequestResponse
    {
        public HttpResponseMessage Response { get; set; }

        /// <summary>
        /// Returns the response content as a JSON object.
        /// </summary>
        /// <typeparam name="T">Type to deserialize JSON.</typeparam>
        public async Task<T> GetFromJsonAsync<T>()
        {
            var responseString = await Response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(responseString);
        }
        /// <summary>
        /// Returns the response content as a raw byte array.
        /// </summary>
        public async Task<byte[]> GetBytesAsync()
        {
            var byteArray = await Response.Content.ReadAsByteArrayAsync();
            return byteArray;
        }
    }
}
