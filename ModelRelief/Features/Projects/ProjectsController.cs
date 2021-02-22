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
#if false
        /// <summary>
        /// Modify the View model before it is presented.
        /// </summary>
        /// <param name="project">Project instance for View.</param>
        protected async override Task<Dto.Project> ModifyDetailsViewModel(Dto.Project project)
        {
            // List<Domain.Model3d> domainModels = await DbContext.Models
            //                                             .Where(m => (m.ProjectId == project.Id)).ToListAsync<Domain.Model3d>();

            IEnumerable<Dto.Model3d> models = Mapper.Map<List<Domain.Model3d>, IEnumerable<Dto.Model3d>>(domainModels);
            project.Models = models;

            return project;
        }
#endif
    }
}
