// -----------------------------------------------------------------------
// <copyright file="Model3d.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using ModelRelief.Services;

    public enum Model3dFormat
    {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL,             // Stereolithography
    }

    [DependentFiles(typeof(DepthBuffer))]
    public class Model3d : FileDomainModel
    {
        public Model3dFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Model3d"/> class.
        /// Default constructor.
        /// </summary>
        public Model3d()
        {
        }
    }
}
