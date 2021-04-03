// -----------------------------------------------------------------------
// <copyright file="IGeneratedFileModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    /// <summary>
    /// Common interface for all DTO generated files (e.g. Mesh, DepthBuffer).
    /// </summary>
    public interface IGeneratedFileModel : IFileModel
    {
        bool FileIsSynchronized { get; set; }        // associated file is synchronized with the model (AND all of the the model's dependencies)
    }
}
