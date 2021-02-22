// -----------------------------------------------------------------------
// <copyright file="ComposerController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Composer
{
    using System.Globalization;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
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
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mapper">IMapper</param>
        /// <param name="mediator">IMediator</param>
        public ComposerController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMapper mapper, IMediator mediator)
            : base(dbContext, loggerFactory, mapper, mediator)
        {
        }

        /// <summary>
        /// Action handler for a Composer request.
        /// </summary>
        /// <param name="id">Mesh Id.</param>
        /// <param name="name">Mesh Name.</param>
        /// <returns>Composer page.</returns>
        public async Task<IActionResult> Edit(int id, [FromQuery] string name)
        {
            if (id == 0)
            {
                var applicationUser = await IdentityUtility.FindApplicationUserAsync(User);

                // query by Name
                var model = DbContext.Meshes
                                                .AsEnumerable()
                                                .Where(m => (m.UserId == applicationUser.Id))
                                                .Where(m => m.Name.StartsWith(name, true, CultureInfo.CurrentCulture))
                                                .FirstOrDefault();
                id = model.Id;
            }

            var mesh = await HandleRequestAsync(new GetSingleRequest<Domain.Mesh, Dto.Mesh>
            {
                User = User,
                Id = id,
            });

            return View(mesh);
        }
    }
}
