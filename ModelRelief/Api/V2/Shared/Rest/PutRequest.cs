// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System.Collections.Generic;
using MediatR;
using ModelRelief.Domain;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    ///  Represents a PUT request to update the properties of a model.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    public class PutRequest<TEntity, TGetModel> : IRequest<TGetModel>
        where TEntity   : ModelReliefModel
        where TGetModel : IGetModel
    {
        /// <summary>
        /// Gets or sets the Id of the model to update.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Dictionary of key:values to use to update the model properties.
        /// </summary>
        public Dictionary<string, object> Parameters { get; set; }
    }
}

