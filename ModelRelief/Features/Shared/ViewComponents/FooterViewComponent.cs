// -----------------------------------------------------------------------
// <copyright file="FooterViewComponent.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Shared.ViewComponents
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Services;

    public class FooterViewComponent : ViewComponent
        {
        private IConfigurationProvider _configurationProvider;

        public FooterViewComponent(IConfigurationProvider configurationProvider)
            {
            _configurationProvider = configurationProvider;
            }

#if true
        public async Task<IViewComponentResult> InvokeAsync()
            {
            // This is the preferred form. It allows the use of await.
            // The async modifier converts the return result to a Task.

            // Server Side Async is not Client Side Async
            // https://stackoverflow.com/questions/36024748/viewcomponents-in-asp-net-mvc-6-are-not-async
            await Task.CompletedTask;

            var versionMessage = _configurationProvider.GetSetting("Version");
            return View("Default", versionMessage);
            }
#endif
        }
    }
