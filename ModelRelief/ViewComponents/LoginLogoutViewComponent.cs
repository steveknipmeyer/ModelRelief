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
        public async Task<IViewComponentResult> InvokeAsync()
            {
            return View ("Default");
            }
        }
    }
