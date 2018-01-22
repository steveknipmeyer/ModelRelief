// -----------------------------------------------------------------------
// <copyright file="ITGetModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System;

    /// <summary>
    /// Common interface for all TGetModel types.
    /// </summary>
    public interface ITGetModel
    {
        int Id { get; set; }

        string Name { get; set; }
        string Description { get; set; }
    }

    /// <summary>
    /// Common interface for all generated files (e.g. Mesh, DepthBuffer).
    /// This interface is used only for integration testing. File-backed domain models inherit from GeneratedFileDomainModel.
    /// </summary>
    public interface IGeneratedFile
    {
        DateTime? FileTimeStamp { get; set; }        // time stamp of backing file
        bool FileIsSynchronized { get; set; }        // associated file is synchronized with the model (AND all of the the model's dependencies)
    }
}
