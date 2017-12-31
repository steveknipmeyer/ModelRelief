// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1.Shared.Rest
{
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

    /// <summary>
    /// Common interface for all generated files (e.g. Nesh, DepthBuffer).
    /// This interface is used only for integration testing. Domain models inherit from GeneratedFileDomainModel.
    /// </summary>
    public interface IGeneratedFile
    {
        bool FileIsSynchronized { get; set; }       // associated file is synchronized with the model (AND all of the the model's dependencies)                
    }
}
