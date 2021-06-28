// -----------------------------------------------------------------------
// <copyright file="Mesh.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System;
    using ModelRelief.Services.Relationships;

    public enum MeshFormat
    {
        None,           // unknown
        SDB,            // single precision depth buffer [0..1]
        DDB,            // double precision depth buffer [0..1]
        SFP,            // single precision float (model units)
        DFP,            // double precision float (model units)
        OBJ,            // Wavefront OBJ
        STL,            // Stereolithography
    }

    public class Mesh : GeneratedFileDomainModel, IProjectModel
    {
        public MeshFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }

        [GeneratedFileProperty]
        public int? DepthBufferId { get; set; }
        public DepthBuffer DepthBuffer { get; set; }

        [GeneratedFileProperty]
        public int? NormalMapId { get; set; }
        public NormalMap NormalMap { get; set; }

        [GeneratedFileProperty]
        public int? MeshTransformId { get; set; }
        public MeshTransform MeshTransform { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Mesh"/> class.
        /// Constructor
        /// </summary>
        public Mesh()
        {
            Name = "Default Mesh";

            Format = Defaults.Mesh.Format;
        }

        /// <summary>
        /// Creates the default element of a Mesh.
        /// </summary>
        /// <returns>Byte array of default Mesh element.</returns>
        public override byte[] CreateDefaultElement()
        {
            switch (Format)
            {
                case MeshFormat.SFP:
                    float defaultElement = 0.0f;
                    return BitConverter.GetBytes(defaultElement);

                default:
                    var message = $"Mesh format {Format} not implemented";
                    throw new NotImplementedException(message);
            }
        }
    }
}
