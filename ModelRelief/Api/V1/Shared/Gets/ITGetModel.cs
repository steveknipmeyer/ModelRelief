// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
    /// <summary>
    /// Represents an interface for a request model.
    /// </summary>
    public interface IIdModel
    {
        int Id { get; set; }
    }

    /// <summary>
    /// Common interface for all TGetModel types.
    /// </summary>
    public interface ITGetModel
    {
        int Id { get; set; }

        // These properties support integration testing across models.
        string Name { get; set; }
        string Description { get; set; }
    }

}
