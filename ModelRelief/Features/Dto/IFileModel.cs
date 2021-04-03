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
    /// Common interface for all DTO file-backed models (e.g. Model3d, Mesh, DepthBuffer).
    /// </summary>
    public interface IFileModel : IModel
    {
        DateTime? FileTimeStamp { get; set; }        // time stamp of backing file
        public IFormFile FormFile { get; set; }
    }
}
