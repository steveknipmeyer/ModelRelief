using Microsoft.AspNetCore.Mvc;

namespace ModelRelief.Controllers
    {
    public class AboutController : Controller
        {
        public IActionResult Phone()
            {
            return Content("571 730 7138");
            }

        [Route ("special/{id?}")]
        public IActionResult Company()
            {
            return Content("ModelRelief, LLC");
            }
        }
    }
