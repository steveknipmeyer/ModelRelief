// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using Microsoft.AspNetCore.Mvc;

namespace ModelRelief.Api.V1.Shared
{
    public interface IUrlHelperContainer
    {
        IUrlHelper Url { get; }
    }
}
