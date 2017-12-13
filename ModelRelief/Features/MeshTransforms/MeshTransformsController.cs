// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ModelRelief.Database;
using ModelRelief.Domain;
using ModelRelief.Utility;
using System.Threading.Tasks;

namespace ModelRelief.Features.MeshTransforms
{
    /// <summary>
    /// Represents a controller to handle MeshTransform Ux requests.
    /// </summary>
    [Authorize]
    public class MeshTransformsController : ViewController<Domain.MeshTransform, Dto.MeshTransform, Dto.MeshTransform, Dto.MeshTransform >
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="dbContext">Database context</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public MeshTransformsController(UserManager<ApplicationUser> userManager, ModelReliefDbContext dbContext, IMapper mapper, IMediator mediator)
            : base(userManager, dbContext, mapper, mediator)
        {
        }
        
        /// <summary>
        /// Setup View controls for select controls, etc.
        /// </summary>
        /// <param name="meshTransform">MeshTransform instance for View.</param>
        protected async override Task InitializeViewControls(Dto.MeshTransform meshTransform = null)
        {
            var applicationUser = await Identity.FindApplicationUserAsync(UserManager, User);
            var userId = applicationUser?.Id ?? "";

            ViewBag.ProjectId = ViewHelpers.PopulateModelDropDownList<Project>(DbContext, userId, "Select a project", meshTransform?.ProjectId);
        }
    }
}
