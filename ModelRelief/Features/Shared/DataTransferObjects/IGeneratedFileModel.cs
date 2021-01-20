// -----------------------------------------------------------------------
// <copyright file="IGeneratedFileModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    /// <summary>
    /// Common interface for all generated files (e.g. Mesh, DepthBuffer).
    /// This interface is used only for integration testing. File-backed domain models inherit from GeneratedFileDomainModel.
    /// </summary>
    public interface IGeneratedFileModel : IFileModel
    {
        bool FileIsSynchronized { get; set; }        // associated file is synchronized with the model (AND all of the the model's dependencies)
    }
}
