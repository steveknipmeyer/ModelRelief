// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using Microsoft.AspNetCore.Mvc;
using ModelRelief.Services;
using System.Threading.Tasks;

namespace ModelRelief.Features.Shared.ViewComponents
{
    public class FooterViewComponent : ViewComponent
        {
        private IConfigurationProvider _configurationProvider;

        public FooterViewComponent(IConfigurationProvider configurationProvider)
            {
            _configurationProvider = configurationProvider;
            }

#if false        
        public IViewComponentResult Invoke()
            {
            // Invoke was removed from ViewComponent however this still compiles.

            var greetingMessage = _configurationProvider.GetGreeting("Greeting");
            return View ("Default", greetingMessage);
            }
#endif

#if false
        public Task<IViewComponentResult> InvokeAsync()
            {
            // This form explicitly converts the return result to a Task.

            var greetingMessage = _configurationProvider.GetGreeting("Greeting");
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

            var greetingMessage = _configurationProvider.GetSetting("Greeting");
            return View ("Default", greetingMessage);
            }
#endif
        }
    }
