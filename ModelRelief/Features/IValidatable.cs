// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Controllers.Api;
using ModelRelief.Infrastructure;
using ModelRelief.Domain;

namespace ModelRelief.Features
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