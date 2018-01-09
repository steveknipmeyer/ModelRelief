﻿// -----------------------------------------------------------------------
// <copyright file="Mesh.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Domain
{
    public enum MeshFormat
        {
        None,           // unknown
        OBJ,            // Wavefront OBJ
        STL,             // Stereolithography
        }

    public class Mesh  : GeneratedFileDomainModel
    {
        public MeshFormat Format { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        public int? CameraId { get; set; }
        public Camera Camera { get; set; }

        public int? DepthBufferId { get; set; }
        public DepthBuffer DepthBuffer { get; set; }

        public int? MeshTransformId { get; set; }
        public MeshTransform MeshTransform { get; set; }

        public Mesh()
        {
        }
    }
}
