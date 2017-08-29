using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Services;

namespace ModelRelief.ViewComponents
    {
    public class LoginLogoutViewComponent : ViewComponent
        {
        #pragma warning disable 1998
        // This async method lacks 'await' operators and will run synchronously. Consider using the 'await' operator to await non-blocking API calls, or 'await Task.Run(...)' to do CPU-bound work on a background thread.
        public async Task<IViewComponentResult> InvokeAsync()
            {
            return View ("Default");
            }
        }
    }
