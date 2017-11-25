// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    ///  Represents a POST request to update a model. 
    /// </summary>
    /// <remarks>All properties are updated.</remarks>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TPostModel">The DTO POST model.</typeparam>
    /// <typeparam name="TGetModel">The DTO POST model.</typeparam>
   public class PostUpdateRequest<TEntity, TPostModel, TGetModel> : IRequest<TGetModel>
        where TEntity    : ModelReliefModel
        where TPostModel : class
        where TGetModel  : IGetModel
    {
        /// <summary>
        ///  Gets or sets the incoming model to be used to update the existing model.
        /// </summary>
        public TPostModel UpdatedModel { get; set; }
    }
}
