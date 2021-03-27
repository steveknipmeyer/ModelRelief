// -----------------------------------------------------------------------
// <copyright file="DepthBuffer.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
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
    public class DepthBuffer  : GeneratedFileDomainModel, IProjectModel
    {
        // Properties
        public int Width { get; set; }
        public int Height { get; set; }
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

        /// <summary>
        /// Initializes a new instance of the <see cref="DepthBuffer"/> class.
        /// Constructor
        /// </summary>
        public DepthBuffer()
        {
            Name = "Default DepthBuffer";

            Width  = Defaults.Resolution.Image;
            Height = Defaults.Resolution.Image;

            Format = DepthBufferFormat.SDB;
        }

        /// <summary>
        /// Creates the default element of a DepthBuffer.
        /// </summary>
        /// <returns>Byte array of default DepthBuffer element.</returns>
        public override byte[] CreateDefaultElement()
        {
            switch (Format)
            {
                case DepthBufferFormat.SDB:
                    float defaultElement = 0.0f;
                    return BitConverter.GetBytes(defaultElement);

                default:
                    var message = $"DepthBuffer format {Format} not implemented";
                    throw new NotImplementedException(message);
            }
        }
    }
}
