// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;
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

    /// <summary>
    ///  Represents a request to perform an operation on a backing file.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <remarks>The returned object represents the status of the operation.</remarks>
    public class FileRequest<TEntity> : IRequest<bool>
        where TEntity : DomainModel
    {
        /// <summary>
        /// Gets or sets the operation to be performed on the file store.
        /// </summary>
        public FileOperation Operation { get; set;}

        /// <summary>
        /// Gets or sets the User of the file owner.
        /// </summary>
        public ApplicationUser User { get; set;}

        /// <summary>
        /// Gets or sets the Id for the file metadata model.
        /// </summary>
        public int Id { get; set; }
    }
}
