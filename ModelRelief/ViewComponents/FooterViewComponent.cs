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

#if false        
        public IViewComponentResult Invoke()
            {
            // Invoke was removed from ViewComponent however this still compiles.

            var greetingMessage = _greeter.GetGreeting();
            return View ("Default", greetingMessage);
            }
#endif

#if false
        public Task<IViewComponentResult> InvokeAsync()
            {
            // This form explicitly converts the return result to a Task.

            var greetingMessage = _greeter.GetGreeting();
            return Task.FromResult<IViewComponentResult>(View ("Default", greetingMessage));
            }
#endif
#if true
        public async Task<IViewComponentResult> InvokeAsync()
            {
            // This is the preferred form. It allows the use of await.
            // The async modifier converts the return result to a Task.
        
            // Server Side Async is not Client Side Async
            // https://stackoverflow.com/questions/36024748/viewcomponents-in-asp-net-mvc-6-are-not-async    
            await Task.Delay(0);

            var greetingMessage = _greeter.GetGreeting();
            return View ("Default", greetingMessage);
            }
#endif
        }
    }
