// -----------------------------------------------------------------------
// <copyright file="NavBarViewComponent.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Shared.ViewComponents
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    public class NavBarViewComponent : ViewComponent
        {
        private ModelReliefDbContext _dbContext { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="NavBarViewComponent"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        public NavBarViewComponent(ModelReliefDbContext dbContext)
            {
            _dbContext = dbContext;
            }

        /// <summary>
        /// Builds a list of Projects belonging to the active user.
        /// </summary>
        private async Task<List<string>> BuildProjectList()
        {
            var projectList = new List<string>();
            if ((User == null) || !User.Identity.IsAuthenticated)
                return projectList;

            var user = await IdentityUtility.FindApplicationUserAsync(HttpContext.User);
            var projects = _dbContext.Set<Project>()
                .Where(m => (m.UserId == user.Id))
                .ToList();

            foreach (var project in projects)
            {
                projectList.Add(project.Name);
            }
            return projectList;
        }
        /// <summary>
        /// Populates a view model containing the list of Projects belonging to the active user.
        /// </summary>
        public async Task<IViewComponentResult> InvokeAsync()
            {
            var projectList = await BuildProjectList();

            return View("NavBar", projectList);
            }
        }
    }
