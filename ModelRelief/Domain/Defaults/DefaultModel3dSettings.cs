// -----------------------------------------------------------------------
// <copyright file="DefaultModel3dSettings.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------
namespace ModelRelief.Domain
{
    /// <summary>
    /// Default mesh settings.
    /// These settings are shared between the backend and frontend through JSON.
    /// </summary>
    public class DefaultModel3dSettings
    {
        public Model3dFormat Format { get; set; }

        /// <summary>
        /// Initialize the settings from JSON definitions.
        /// </summary>
        /// <param name="settingsJson">Raw JSON settings</param>
        public void Initialize(dynamic settingsJson)
        {
            Format = settingsJson.Model3d.Format;
        }
    }
}
