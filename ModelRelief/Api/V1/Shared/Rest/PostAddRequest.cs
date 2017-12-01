// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using MediatR;
using ModelRelief.Domain;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    ///  Represents a POST request to create a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TPostModel">The DTO POST model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
   public class PostAddRequest<TEntity, TPostModel, TGetModel> : IRequest<TGetModel>
        where TEntity    : ModelReliefModel
        where TPostModel : class
        where TGetModel  : IGetModel
    {
        /// <summary>
        ///  Gets or sets the incoming model to be used to create the new domain model.
        /// </summary>
        public TPostModel NewModel { get; set; }
    }
}
