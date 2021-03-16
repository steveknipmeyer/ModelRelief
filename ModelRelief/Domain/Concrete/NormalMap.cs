// -----------------------------------------------------------------------
// <copyright file="NormalMap.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
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
        public double Width { get; set; }
        public double Height { get; set; }
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

        public NormalMap()
        {
        }
    }
}
