// -----------------------------------------------------------------------
// <copyright file="Mesh.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    using ModelRelief.Features.Settings;
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
        public Mesh()
        {
            Format = Defaults.Mesh.Format;
        }
    }
}
