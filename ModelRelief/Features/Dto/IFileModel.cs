// -----------------------------------------------------------------------
// <copyright file="IFileModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System;
    using Microsoft.AspNetCore.Http;

    /// <summary>
    /// Common interface for all file-backed models (e.g. Model3d, Mesh, DepthBuffer).
    /// This interface is used only for integration testing. File-backed domain models inherit from GeneratedFileDomainModel.
    /// </summary>
    public interface IFileModel : IModel
    {
        DateTime? FileTimeStamp { get; set; }        // time stamp of backing file
        public IFormFile FormFile { get; set; }
    }
}
