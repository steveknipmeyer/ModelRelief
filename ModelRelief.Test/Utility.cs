// -----------------------------------------------------------------------
// <copyright file="Utility.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test
{
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Helper methods for automated testing.
    /// </summary>
    public class Utility
    {
        /// <summary>
        /// Returns a byte array from a file. The file must exist in Test/Data/Files.
        /// </summary>
        /// <param name="fileName">File to read.</param>
        public static byte[] ByteArrayFromFile(string fileName)
        {
            var fileNamePath = Settings.GetTestFilePath(fileName);
            if (fileNamePath == null)
                return null;

            var byteArray = File.ReadAllBytes(fileNamePath);

            return byteArray;
        }

        /// <summary>
        /// Returns a float list from a file. The file must exist in Test/Data/Files.
        /// </summary>
        /// <param name="fileName">File to read.</param>
        public static List<float> FloatListFromFile(string fileName)
        {
            var fileNamePath = Settings.GetTestFilePath(fileName);
            if (fileNamePath == null)
                return null;

            var floatList = new List<float>();
            using (TextReader reader = File.OpenText(fileNamePath))
            {
                float value = float.Parse(reader.ReadLine());
                floatList.Add(value);
            }

            return floatList;
        }

        /// <summary>
        /// Compare two byte arrays for equality.
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
