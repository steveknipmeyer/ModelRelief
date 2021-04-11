// -----------------------------------------------------------------------
// <copyright file="IFileRequest.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using ModelRelief.Services.Relationships;

    /// <summary>
    /// Represents the common interface for all FileRequests.
    /// FileRequests are file commands (.e.g Rename, Generate) that operate on the backing files.
    /// </summary>
    public interface IFileRequest
    {
        FileOperation       Operation { get; set; }
        ProcessingStage     Stage { get; set; }
        TransactionEntity   TransactionEntity { get; set; }
    }
}
