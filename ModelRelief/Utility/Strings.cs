// -----------------------------------------------------------------------
// <copyright file="Strings.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Utility
{
    using System.Linq;
    public class Strings
    {
        /// <summary>
        /// Capitalize the first letter of a string.
        /// </summary>
        /// <param name="theString">String to capitalize.</param>
        /// <returns>String with first letter capitalized.</returns>
        public static string Captitalize(string theString)
        {
            if (string.IsNullOrEmpty(theString))
                return string.Empty;

            // https://stackoverflow.com/questions/35549797/capitalizing-the-first-letter-of-a-string-only
            string capitalizedString = char.ToUpper(theString.First()) + theString.Substring(1).ToLower();
            return capitalizedString;
        }
    }
}