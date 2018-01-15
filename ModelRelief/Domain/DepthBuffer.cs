// -----------------------------------------------------------------------
// <copyright file="DepthBuffer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using ModelRelief.Services.Relationships;

    public enum DepthBufferFormat
    {
        None,       // unknown
        RAW,        // floating point array
        PNG,        // PNG format
        JPG,        // JPG format
    }

    [DependentFiles(typeof(Mesh))]
    public class DepthBuffer  : GeneratedFileDomainModel
    {
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

        public DepthBuffer()
        {
        }
    }
}
