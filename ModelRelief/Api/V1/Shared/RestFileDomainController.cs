// -----------------------------------------------------------------------
// <copyright file="RestFileDomainController.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared
{
    using System.Threading.Tasks;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Database;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    public abstract class RestFileDomainController<TEntity, TGetModel, TRequestModel> : RestController<TEntity, TGetModel, TRequestModel>
        where TEntity         : DomainModel
        where TGetModel       : IModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RestFileDomainController{TEntity, TGetModel, TRequestModel}"/> class.
        /// Constructor
        /// </summary>
        /// <param name="dbContext">Database context.</param>
        /// <param name="loggerFactory">ILoggerFactor.</param>
        /// <param name="mediator">IMediator.</param>
        /// <remarks>Defaults to use paging.</remarks>
        protected RestFileDomainController(ModelReliefDbContext dbContext, ILoggerFactory loggerFactory, IMediator mediator)
            : base(dbContext, loggerFactory, mediator, new RestControllerOptions { UsePaging = true })
        {
        }

        #region Get
        [HttpGet("{id:int}/file")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> GetBacking(int id)
        {
            return await GetFileByType(id, GetFileType.Backing);
        }

        [HttpGet("{id:int}/preview")]
        [DisableRequestSizeLimit]
        public virtual async Task<IActionResult> GetPreview(int id)
        {
            return await GetFileByType(id, GetFileType.Preview);
        }

        /// <summary>
        ///  Helper to get a specific file type.
        /// </summary>
        /// <param name="id">Model Id.</param>
        /// <param name="fileType">Type of file.</param>
        /// <returns></returns>
        private async Task<IActionResult> GetFileByType(int id, GetFileType fileType)
        {
            var result = await HandleRequestAsync(new GetFileRequest<TEntity>
            {
                User = User,
                Id = id,
                FileType = fileType,
            });
            var okObjectResult = result as OkObjectResult;
            if (okObjectResult == null)
                return result;

            var fileContentResult = okObjectResult.Value as FileContentResult;
            return fileContentResult;
        }
        #endregion
   }
}