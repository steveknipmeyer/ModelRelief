﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V2.Shared.Rest
{
    /// <summary>
    /// Represents an interface for a REST GET request model.
    /// </summary>
    public interface IGetModel
    {
        int Id { get; }
    }
}
