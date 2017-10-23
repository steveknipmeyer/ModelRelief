using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Controllers.Api;

namespace ModelRelief.Models
{
    public interface IValidatable<TResource>
        where TResource : ModelReliefEntity
    {
        ObjectResult ErrorResult(HttpContext context, Controller controller);
        bool Validate(User user, ApiController<TResource> controller, int? id = null);
    }
}