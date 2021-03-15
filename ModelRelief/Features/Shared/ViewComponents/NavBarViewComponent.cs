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
    using AutoMapper;
    using Microsoft.AspNetCore.Mvc;
    using ModelRelief.Database;
    using ModelRelief.Utility;

    public class NavBarViewComponent : ViewComponent
        {
        private ModelReliefDbContext _dbContext { get; set; }
        private IMapper _mapper { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="NavBarViewComponent"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="mapper">IMapper</param>
        public NavBarViewComponent(ModelReliefDbContext dbContext, IMapper mapper)
            {
            _dbContext = dbContext;
            _mapper = mapper;
            }

        /// <summary>
        /// Builds a list of Projects belonging to the active user.
        /// </summary>
        private async Task<List<Dto.Project>> BuildProjectList()
        {
            var projectList = new List<Dto.Project>();
            if ((User == null) || !User.Identity.IsAuthenticated)
                return projectList;

            var user = await IdentityUtility.FindApplicationUserAsync(HttpContext.User);
            var projects = _dbContext.Set<Domain.Project>()
                .Where(m => (m.UserId == user.Id))
                .ToList();

            foreach (var project in projects)
            {
                projectList.Add(_mapper.Map<Dto.Project>(project));
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
