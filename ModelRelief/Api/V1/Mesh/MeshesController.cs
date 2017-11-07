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
    [Route ("api/v1/[controller]")]        
    public class MeshesController : ApiController<Mesh>
    {
        public MeshesController(IHostingEnvironment hostingEnvironment, UserManager<ApplicationUser> userManager, IModelsProvider modelsProvider, ILogger<Mesh> logger, Services.IConfigurationProvider configurationProvider, IMapper mapper) :
            base (hostingEnvironment, userManager, modelsProvider.Meshes, logger, configurationProvider, mapper)
        {
        }

        [HttpPost]
        [Consumes("application/octet-stream")]
        [DisableRequestSizeLimit]
        public async Task<ObjectResult> Post()
        { 
            // construct from body
            var meshPostRequest = new MeshPostModel(Files.ReadToEnd(Request.Body));

            // initial validation
            var user = await Identity.GetCurrentUserAsync(UserManager, User);
            meshPostRequest.Validate(user, this);
            if (!ModelState.IsValid)
                return meshPostRequest.ErrorResult(this);

            var filePostCommandProcessor = new FilePostCommandProcessor<MeshPostModel, Mesh>(user, this);
            return await filePostCommandProcessor.Process(meshPostRequest, meshPostRequest.Raw);
        }

        [HttpPut ("{id?}")]
        [Consumes("application/json")]
        public async Task<ObjectResult> Put([FromBody] MeshPutModel meshPutModel, int id )
        { 
            // initial validation
            var user = await Identity.GetCurrentUserAsync(UserManager, User);
            meshPutModel.Validate(user, this, id);
            if (!ModelState.IsValid)
                return meshPutModel.ErrorResult(this);

            var filePutCommandProcessor = new FilePutCommandProcessor<MeshPutModel, Mesh>(user, this);
            return await filePutCommandProcessor.Process(id, meshPutModel);
        }
    }        
}
