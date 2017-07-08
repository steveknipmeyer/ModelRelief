using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ModelRelief.Services;

namespace ModelRelief.ViewComponents
    {
    public class FooterViewComponent : ViewComponent
        {
        private IGreeter _greeter;

        public FooterViewComponent(IGreeter greeter)
            {
            _greeter = greeter;
            }
        
        public async Task<IViewComponentResult> InvokeAsync()
            {
            var greetingMessage = _greeter.GetGreeting();
            return View ("Default", greetingMessage);
            }
        }
    }
