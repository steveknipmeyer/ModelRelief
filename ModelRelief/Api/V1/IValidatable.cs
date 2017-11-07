// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Api.V1;
using ModelRelief.Domain;
using ModelRelief.Infrastructure;

namespace ModelRelief.Api.V1
{
    public interface IValidatable<TModel>
        where TModel : ModelReliefModel
    {
        bool Validate(ApplicationUser user, ApiController<TModel> controller, int? id = null);

        ObjectResult ErrorResult(Controller controller, 
            int httpStatusCode      = StatusCodes.Status400BadRequest, 
            int apiStatusCode       = (int) ApiStatusCode.Default, 
            string developerMessage = "An error occurred validating the properties of the request.");
    }
}