// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ModelRelief.Domain;
using ModelRelief.Services;
using ModelRelief.Utility;
using System.Threading.Tasks;

namespace ModelRelief.Api.V1
{
    // [Authorize]
    [Area("ApiV1")]
    [Route ("api/v1/depth-buffers")]        
    public class DepthBuffersController : ApiController<DepthBuffer>
    {
        public DepthBuffersController(IHostingEnvironment hostingEnvironment, UserManager<ApplicationUser> userManager, IModelsProvider modelsProvider, ILogger<DepthBuffer> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper) :
            base (hostingEnvironment, userManager, modelsProvider.DepthBuffers, logger, configurationProvider, mapper)
        {
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public async Task<ObjectResult> Post()
        { 
            // construct from body
            var depthBufferPostRequest = new DepthBufferPostModel(Files.ReadToEnd(Request.Body));

            // initial validation
            var user = await Identity.GetCurrentUserAsync(UserManager, User);
            depthBufferPostRequest.Validate(user, this);
            if (!ModelState.IsValid)
                return depthBufferPostRequest.ErrorResult(this);

            var filePostCommandProcessor = new FilePostCommandProcessor<DepthBufferPostModel, DepthBuffer>(user, this);
            return await filePostCommandProcessor.Process(depthBufferPostRequest, depthBufferPostRequest.Raw);
        }

        [HttpPut ("{id?}")]
        [Consumes("application/json")]
        public async Task<ObjectResult> Put([FromBody] DepthBufferPutModel depthBufferPutModel, int id )
        { 
            // initial validation
            var user = await Identity.GetCurrentUserAsync(UserManager, User);
            depthBufferPutModel.Validate(user, this, id);
            if (!ModelState.IsValid)
                return depthBufferPutModel.ErrorResult(this);

            var filePutCommandProcessor = new FilePutCommandProcessor<DepthBufferPutModel, DepthBuffer>(user, this);
            return await filePutCommandProcessor.Process(id, depthBufferPutModel);
        }
    }        
}
