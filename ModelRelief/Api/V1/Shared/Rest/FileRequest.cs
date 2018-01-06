// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;
using ModelRelief.Services;
using System;
using System.Security.Claims;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents the possible operations that can be performed on a backing file.
    /// </summary>
    public enum FileOperation
    {
        Unknown,                // no operation
        Rename,                 // rename the file to match the metadata name
        Generate                // generate a new version from the file's dependencies
    }
    public interface IFileRequest
    {
        FileOperation       Operation { get; set; }
        TransactionEntity   TransactionEntity { get; set;}
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
        public FileOperation Operation { get; set;}

        /// <summary>
        /// Gets or sets the ChangeTracker transaction entity.
        /// </summary>
        public TransactionEntity TransactionEntity { get; set;}

        /// <summary>
        /// Constructor
        /// A public constructor is needed so it can be located through reflection.
        /// </summary>
        public FileRequest()
        {
        }
    }
}
