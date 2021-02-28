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
        public IViewComponentResult Invoke()
            {
            var versionMessage = _configurationProvider.GetSetting("Version");
            return View("Default", versionMessage);
            }
        }
    }
