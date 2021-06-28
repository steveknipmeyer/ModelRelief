// -----------------------------------------------------------------------
// <copyright file="PropertyNames.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    /// <summary>
    /// Represents defined names of key domain model properties.
    /// </summary>
    public class PropertyNames
    {
        public const string Name               = "Name";                    // model name
        public const string FileIsSynchronized = "FileIsSynchronized";      // backing file for a model is synchronized with all dependencies
        public const string FileTimeStamp      = "FileTimeStamp";           // backing file time stamp
    }
}
