// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System.Threading.Tasks;

namespace ModelRelief.Features.DepthBuffers
{
    /// <summary>
    /// Represents a controller to handle DepthBuffer Ux requests.
    /// </summary>
    [Authorize]
    public class DepthBuffersController : ViewController<Domain.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer, Dto.DepthBuffer>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public DepthBuffersController(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : base(userManager, dbContext, mapper, mediator)
        {
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="depthBuffer">DepthBuffer instance for View.</param>
        protected async override Task InitializeViewControls(Dto.DepthBuffer depthBuffer = null)
        {
            var applicationUser = await Identity.FindApplicationUserAsync(UserManager, User);
            var userId = applicationUser?.Id ?? "";

            ViewBag.DepthBufferFormats  = ViewHelpers.PopulateEnumDropDownList<DepthBufferFormat>("Select depth buffer format");

            ViewBag.ProjectId = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", depthBuffer?.ProjectId);
            ViewBag.ModelId   = ViewHelpers.PopulateModelDropDownList<Model3d>(DbContext, userId, "Select a model", depthBuffer?.ModelId);
            ViewBag.CameraId  = ViewHelpers.PopulateModelDropDownList<Camera>(DbContext, userId, "Select a camera", depthBuffer?.CameraId);
        }
    }
}
