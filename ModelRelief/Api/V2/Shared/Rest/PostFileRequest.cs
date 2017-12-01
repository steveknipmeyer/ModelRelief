// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;
using ModelRelief.Dto;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    ///  Represents a POST request of a file to create a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
   public class PostFileRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity    : ModelReliefModel
        where TGetModel  : IGetModel
    {
        /// <summary>
        ///  Gets or sets the incoming file to be used to create the new domain model.
        /// </summary>
        public PostFile NewFile { get; set; }
    }
}
