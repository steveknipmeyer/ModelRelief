// -----------------------------------------------------------------------
// <copyright file="ComposerController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Composer
{
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Utility;

    /// <summary>
    /// Represents a controller to handle Composer requests.
    /// </summary>
    [Authorize]
    public class ComposerController : UxController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ComposerController"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="userManager">UserManager (ClaimsPrincipal -> ApplicationUser).</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public ComposerController(ModelReliefDbContext dbContext, UserManager<ApplicationUser> userManager, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, userManager, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Action handler for a Composer request.
        /// </summary>
        /// <param name="id">Mesh Id.</param>
        /// <returns>Composer page.</returns>
        public async Task<IActionResult> Edit(int id)
        {
            var mesh = await HandleRequestAsync(new GetSingleRequest<Domain.Mesh, Dto.Mesh>
            {
                User = User,
                Id = id,
            });

            return View(mesh);
        }
    }
}
