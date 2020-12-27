// -----------------------------------------------------------------------
// <copyright file="DataConversion.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System;
    using System.IO;
    using Microsoft.AspNetCore.Html;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    public class DataConversion
    {
        /// <summary>
        /// Returns a byte array from a stream.
        /// https://stackoverflow.com/questions/221925/creating-a-byte-array-from-a-stream
        /// </summary>
        /// <param name="input">Stream to read</param>
        /// <returns>Byte array</returns>
        public static byte[] StreamToByteArray(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream memoryStream = new MemoryStream())
            {
                input.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

        /// <summary>
        /// Converts a byte array to an array of single precision floats.
        /// https://stackoverflow.com/questions/5056635/converting-raw-byte-data-to-float
        /// </summary>
        /// <param name="byteArray">Byte array to convert</param>
        /// <returns></returns>
        public static float[] ByteArrayToFloatArray(byte[] byteArray)
        {
            float[] floatArray = new float[byteArray.Length / 4];
            for (int iFloat = 0; iFloat < floatArray.Length; iFloat++)
            {
            #if false
                if (BitConverter.IsLittleEndian) {
                    Array.Reverse(byteArray, iFloat * 4, 4);
            #endif
            floatArray[iFloat] = BitConverter.ToSingle(byteArray, iFloat * 4);
            }
            return floatArray;
        }

        /// <summary>
        /// Convert a JavaScript object to an HTML-encoded string.
        /// https://blog.mariusschulz.com/2014/02/05/passing-net-server-side-data-to-javascript
        /// </summary>
        /// <param name="value">Object to serialize to HTML encoded string.</param>
        public static IHtmlContent SerializeObject(object value)
        {
            using (var stringWriter = new StringWriter())
            using (var jsonWriter = new JsonTextWriter(stringWriter))
            {
                var serializer = new JsonSerializer
                {
                    // use camelCasing as is common practice in JavaScript
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),

                    // skip nulls
                    NullValueHandling = NullValueHandling.Ignore,
                };

                // quote object names for JSON.parse
                jsonWriter.QuoteName = true;

                serializer.Serialize(jsonWriter, value);

                return new HtmlString(stringWriter.ToString());
            }
        }
    }
}