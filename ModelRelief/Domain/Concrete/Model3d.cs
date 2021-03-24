// -----------------------------------------------------------------------
// <copyright file="Model3d.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Collections.Generic;
    using ModelRelief.Services.Relationships;

    public enum Model3dFormat
    {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL,            // Stereolithography
    }

    [DependentFiles(typeof(DepthBuffer))]
    public class Model3d : FileDomainModel, IProjectModel
    {
        public Model3dFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }

        public ICollection<DepthBuffer> DepthBuffers { get; set; }
        public ICollection<NormalMap> NormalMaps { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Model3d"/> class.
        /// Default constructor.
        /// </summary>
        public Model3d()
        {
            Format = Defaults.Model3d.Format;
        }
    }
}
