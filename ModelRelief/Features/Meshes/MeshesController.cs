// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System.Threading.Tasks;

namespace ModelRelief.Features.Meshes
{
    /// <summary>
    /// Represents a controller to handle Mesh Ux requests.
    /// </summary>
    [Authorize]
    public class MeshesController : ViewController<Domain.Mesh, Dto.Mesh, Dto.Mesh, Dto.Mesh>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public MeshesController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, userManager, loggerFactory, mapper, mediator)
        {
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="mesh">Mesh instance for View.</param>
        protected async override Task InitializeViewControls(Dto.Mesh mesh = null)
        {
            var applicationUser = await Identity.FindApplicationUserAsync(UserManager, User);
            var userId = applicationUser?.Id ?? "";

            ViewBag.MeshFormat      = ViewHelpers.PopulateEnumDropDownList<MeshFormat>("Select mesh format");

            ViewBag.ProjectId       = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", mesh?.ProjectId);
            ViewBag.CameraId        = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", mesh?.CameraId);
            ViewBag.DepthBufferId   = ViewHelpers.PopulateModelDropDownList<DepthBuffer>(DbContext, userId, "Select a depth buffer", mesh?.DepthBufferId);
            ViewBag.MeshTransformId = ViewHelpers.PopulateModelDropDownList<MeshTransform>(DbContext, userId, "Select a mesh transform", mesh?.CameraId);
        }
    }
}
