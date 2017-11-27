// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared.Errors
{
    /// <summary>
    ///  Represents an exception when a given entity cannot be found in the database.
    /// </summary>
    public class EntityNotFoundException : Exception
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="entityType">Type of entity.</param>
        /// <param name="id">Unique Id of entity.</param>
        public EntityNotFoundException(Type entityType, int id) 
            : base($"A {entityType.Name} with Id {id} was not found.") {}
    }
}
