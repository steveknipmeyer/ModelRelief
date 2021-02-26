// -----------------------------------------------------------------------
// <copyright file="DepthBuffer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System.Collections.Generic;
    using ModelRelief.Services.Relationships;

    public enum DepthBufferFormat
    {
        None,       // unknown
        SDB,        // single precision depth buffer
        DDB,        // double precision depth buffer
        PNG,        // PNG format
        JPG,        // JPG format
    }

    [DependentFiles(typeof(Mesh))]
    public class DepthBuffer  : GeneratedFileDomainModel
    {
        public double Width { get; set; }
        public double Height { get; set; }
        public DepthBufferFormat Format { get; set; }

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

        public DepthBuffer()
        {
        }
    }
}
