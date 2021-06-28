// -----------------------------------------------------------------------
// <copyright file="FooterViewComponent.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
        public async Task<IViewComponentResult> InvokeAsync()
            {
                await Task.CompletedTask;

                var versionMessage = _configurationProvider.GetSetting("Version");
                return View("Footer", versionMessage);
            }
        }
    }
