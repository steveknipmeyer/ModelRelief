// -----------------------------------------------------------------------
// <copyright file="MeshGridViewComponent.cs" company="ModelRelief">
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
    using Microsoft.EntityFrameworkCore;
    using ModelRelief.Database;
    using ModelRelief.Utility;

    public class MeshGridViewComponent : ViewComponent
        {
        private ModelReliefDbContext _dbContext { get; set; }
        private IMapper _mapper { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MeshGridViewComponent"/> class.
        /// Constructor.
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="mapper">IMapper</param>
        public MeshGridViewComponent(ModelReliefDbContext dbContext, IMapper mapper)
            {
            _dbContext = dbContext;
            _mapper = mapper;
            }

        /// <summary>
        /// Builds a list of Projects belonging to the active user.
        /// </summary>
        /// <param name="projectName">Project to find Meshes.</param>
        private async Task<List<Dto.Mesh>> BuildMeshList(string projectName)
        {
            var meshList = new List<Dto.Mesh>();
            if ((User == null) || !User.Identity.IsAuthenticated)
                return meshList;

            var user = await IdentityUtility.FindApplicationUserAsync(HttpContext.User);
            var project = _dbContext.Set<Domain.Project>()
                .Where(p => (p.UserId == user.Id &&
                             string.Equals(p.Name, projectName)))
                .Include(p => p.Meshes)
                .First();

            foreach (var mesh in project.Meshes)
            {
                meshList.Add(_mapper.Map<Dto.Mesh>(mesh));
            }
            return meshList;
        }
        /// <summary>
        /// Populates a view model containing the list of Meshes belonging to the given Project.
        /// </summary>
        /// <param name="project">Project to find Meshes.</param>
        public async Task<IViewComponentResult> InvokeAsync(string project)
            {
            var meshList = await BuildMeshList(project);

            return View("MeshGrid", meshList);
            }
        }
    }
