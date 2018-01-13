// -----------------------------------------------------------------------
// <copyright file="Utility.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.IO;
    using System.Threading;

    /// <summary>
    /// Helper methods for automated testing.
    /// </summary>
    public class Utility
    {
        /// <summary>
        /// Returns a byte array from a file. The file must exist in Test\Data\Files.
        /// </summary>
        /// <param name="fileName">File to read.</param>
        /// <returns></returns>
        public static byte[] ByteArrayFromFile(string fileName)
        {
            var fileNamePath = $"{Settings.GetTestFilesPath()}/{fileName}";
            if (!File.Exists(fileNamePath))
                return null;

            var byteArray = File.ReadAllBytes(fileNamePath);

            return byteArray;
        }

        /// <summary>
        /// Compare two byte arrays for equslity.
        /// http://www.techmikael.com/2009/01/fast-byte-array-comparison-in-c.html
        /// </summary>
        /// <param name="first">First array to compare.</param>
        /// <param name="second">Second array to compare.</param>
        /// <returns>True if identical.</returns>
        public static bool EqualByteArrays(byte[] first, byte[] second)
        {
            int length = first.Length;
            if (length != second.Length)
                return false;

            for (int i = 0; i < length; i++)
            {
                if (first[i] != second[i])
                    return false;
            }
            return true;
        }
    }
}
