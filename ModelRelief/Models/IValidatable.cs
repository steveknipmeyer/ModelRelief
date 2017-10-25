using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Controllers.Api;

namespace ModelRelief.Models
{
    public interface IValidatable<TModel>
        where TModel : ModelReliefModel
    {
        ObjectResult ErrorResult(Controller controller);
        bool Validate(User user, ApiController<TModel> controller, int? id = null);
    }
}