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
    /// Common interface for all TGetModel ( = FileDomainModel) types.
    /// This interface is used to support integration testing where the file metadata is updated after a PostFile.
    /// </summary>
    public interface IFileIsSynchronized
    {
        bool FileIsSynchronized { get; set; }
    }
}
