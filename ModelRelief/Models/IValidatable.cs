using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using ModelRelief.Services;

namespace ModelRelief.Models
{
    public interface IValidatable
    {
        ObjectResult ErrorResult(HttpContext context, Controller controller);
        bool Validate(User user, IResourcesProvider resourceProvider, ModelStateDictionary modelState, int? id = null);
    }
}