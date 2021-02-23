// -----------------------------------------------------------------------
// <copyright file="ProjectsController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Projects
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using AutoMapper.QueryableExtensions;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Database;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Project Ux requests.
    /// </summary>
    [Authorize]
    public class ProjectsController : ViewController<Domain.Project, Dto.Project, Dto.Project, Dto.Project>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProjectsController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public ProjectsController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="project">Project instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Project project = null)
        {
            var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);
            var userId = applicationUser?.Id ?? string.Empty;
        }

        /// <summary>
        /// Modify the View model before it is presented.
        /// </summary>
        /// <param name="project">Project instance for View.</param>
        protected async override Task<Dto.Project> ModifyDetailsViewModel(Dto.Project project)
        {
            var domainProject = DbContext.Set<Domain.Project>()
                                            .Where(m => (m.Id == project.Id))
                                            .Include(m => m.Models);

            project = await Mapper.ProjectTo<Dto.Project>(domainProject).SingleAsync<Dto.Project>();
            project.Models = Mapper.Map<ICollection<Dto.Model3d>>(domainProject.First().Models);

            return project;
        }
    }
}
