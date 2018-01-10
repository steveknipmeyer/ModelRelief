// -----------------------------------------------------------------------
// <copyright file="FileRequest.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using MediatR;
    using ModelRelief.Domain;
    using ModelRelief.Services.Relationships;

    /// <summary>
    /// Represents the possible operations that can be performed on a backing file.
    /// </summary>
    public enum FileOperation
    {
        Unknown,                // no operation
        Rename,                 // rename the file to match the metadata name
        Generate,                // generate a new version from the file's dependencies
    }

    /// <summary>
    /// Represents the processing stage that the FileRequest will be handled.
    /// Added entities are deferred to the PostProcess stage so that the newly-assigned primary key will be available.
    /// </summary>
    public enum ProcessingStage
    {
        Unknown,
        PreProcess,
        PostProcess,
    }

    /// <summary>
    ///  Represents a request to perform an operation on a backing file.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <remarks>The returned object represents the status of the operation.</remarks>
    public class FileRequest<TEntity> : IFileRequest, IRequest<bool>
        where TEntity : DomainModel
    {
        /// <summary>
        /// Gets or sets the operation to be performed on the file store.
        /// </summary>
        public FileOperation Operation { get; set; }

        /// <summary>
        /// Gets or sets the processing stage that the FileRequest will be executed.
        /// </summary>
        public ProcessingStage Stage { get; set; }

        /// <summary>
        /// Gets or sets the ChangeTracker transaction entity.
        /// </summary>
        public TransactionEntity TransactionEntity { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FileRequest{TEntity}"/> class.
        /// Constructor
        /// A public constructor is needed so it can be located through reflection.
        /// </summary>
        public FileRequest()
        {
        }
    }
}
