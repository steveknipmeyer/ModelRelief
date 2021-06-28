// -----------------------------------------------------------------------
// <copyright file="NormalMap.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System;
    using System.Collections.Generic;
    using ModelRelief.Services.Relationships;

    public enum NormalMapFormat
    {
        None,       // unknown
        NMAP,       // 8-bit normal map (XYZ)
        PNG,        // PNG format
        JPG,        // JPG format
    }

    public enum NormalMapSpace
    {
        None,       // unknown
        Object,
        Tangent,
    }
    [DependentFiles(typeof(Mesh))]
    public class NormalMap  : GeneratedFileDomainModel, IProjectModel
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public NormalMapFormat Format { get; set; }
        public NormalMapSpace Space { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        [DependentFileProperty]
        [GeneratedFileProperty]
        public int? Model3dId { get; set; }
        public Model3d Model3d { get; set; }

        [DependentFileProperty]
        [GeneratedFileProperty]
        public int? CameraId { get; set; }
        public Camera Camera { get; set; }
        public ICollection<Mesh> Meshes { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="NormalMap"/> class.
        /// Constructor
        /// </summary>
        public NormalMap()
        {
            Name = "Default NormalMap";

            Width = Defaults.Resolution.Image;
            Height = Defaults.Resolution.Image;

            Format = NormalMapFormat.NMAP;
        }

        /// <summary>
        /// Creates the default element of a NormalMap.
        /// </summary>
        /// <returns>Byte array of default NormalMap element.</returns>
        public override byte[] CreateDefaultElement()
        {
            switch (Format)
            {
                case NormalMapFormat.NMAP:
                    float defaultElement = 0.0f;
                    return BitConverter.GetBytes(defaultElement);

                default:
                    var message = $"NormalMap format {Format} not implemented";
                    throw new NotImplementedException(message);
            }
        }
    }
}
