﻿##### Commit Notes
Exclude User property from JSON serialization.
Move test model Name assignment to concrete classes so the names can reflect the type (not generic "Test Model") and include an extension.
Normalize Path in PostFileRequestHandler.

Some Markdown text with <span style="color:blue">some *blue* text

##### Technical Education
- Manning AspNet Core book.
- Manning Dependency Injection book.


#####  Lambda
    Python programs must be invoked by py <program>. This is not necessary on Vector.


### Tasks

#### Short Term


##### Mesh Generation Prototype
    
    UnitTest
       Scale the DepthBuffer and create a raw Mesh.
        Verify the depth values of the Mesh have been scaled from the original DepthBuffer.
        

    Current
        Client
            Create DepthBuffer
            DepthBufferFactory -> Create Mesh
            Post DepthBuffer

| Client | Server|
|-------|--------|
|Create DepthBuffer in-memory | |
|Post DepthBuffer | |
|Post DepthBuffer/id/file | |
|Post MeshTransform  | |
|Post Mesh = Mesh (DepthBuffer, MeshTransform)| |
|Patch Mesh.FileIsSynchronized = true  | |
|| Solver <Mesh.json> filename |
|| Post Mesh/id/file (raw file)|
| Get Mesh/id/file||
| Construct Mesh from raw file||


##### Critical Issues
<span style="color:red">
Replace DateTime with a type that has more resolution.
</span><br></br>

###### Improve rollback handling in integration tests.
    try/catch/finally?

###### FileOperationGenerate
    Validate the required properties are present.
        Implement a FluentValidation validator.
        Throw a validation exception if the required properties are not set.

###### CodeAnalysis
    NET Core?

###### Refactoring Suggestion Font Size

###### Replace Console output with Logger operations.
    Add color support for logging.

###### Should FileTimeStamp be exposed?
    Should the assignment of FileSynchronized be deferred until the request has completed?
    FileStamp could potentially serve as the "complete" flag for a long-running request. 

#### Python Tasks
###### Virtual Evironment
    Create a virtual environment that is published with the web application.
    This will allow the Python path and runtime environment to be precisely defined.

###### Queues
```<language>
FileRequest places a message in a work queue.  
    FileIsSynchronized is reset to false.  
    A status code of 202 is returned to the client who can poll the value of FileIsSynchronized.
        Consider returning an endpoint that can be used for querying the result of the task.
        meshes/id/file/task
A worker process removes the request from the queue.
    An external job is dispatched which returns some kind of notification when complete.  
    When the external job completes, the worker process sets FileIsSynchronized = true.
    Question: How does a worker process access the database?
    

```

https://stackoverflow.com/questions/11779143/how-do-i-run-a-python-script-from-c  
https://medium.com/@dpursanov/running-python-script-from-c-and-working-with-the-results-843e68d230e5

https://stackoverflow.com/questions/10788982/is-there-any-async-equivalent-of-process-start
https://github.com/jamesmanning/RunProcessAsTask

Long-running Requests:   
https://stackoverflow.com/questions/33009721/long-running-rest-api-with-queues

#### Dependency Manager

##### Dependency Handling                    
**Modified**           
- [x] For GeneratedFileDomainModel root models, if FileIsSynchronized <changed> to true, schedule a FileOperation.Generation.
- [x] For FileDomainModel root models, if Name <changed>, schedule a FileOperation.Rename.
- [x] For all GeneratedFileDomainModel dependents, set FileIsSynchronized = false.

**Deleted**
- [x] For all GeneratedFileDomainModel dependents, set FileIsSynchronized = false.

**Added**
- [x] For all GeneratedFileDomainModel root models, if FileIsSynchronized = true, schedule a file generation if the dependents are resolved.

```
GeneratedFileDomainModel Dependencies
                                        Metadata    FileTimeStamp
    DepthBuffer
        Model                                       X
        Camera                          X
    Mesh
        DepthBuffer                                 X
        MeshTransform                   X

```
###### DepthBuffers should have an optional dependency on a Model3d.
    If the Model3d relationship is present, the dependency exists.  
    Otherwise, the DepthBuffer exists independently, probably due to an explicit upload of a file created in another application.  
    The DependencyManager invalidates DependentFiles only if a dependency changed. So, an existing DepthBuffer with (FileSynchronized = true) would not be impacted.

###### Property Change Handlers
https://msdn.microsoft.com/magazine/mt694083  
https://msdn.microsoft.com/en-us/magazine/mt767693.aspx

###### How can properties be excluded (e.g. Attribute) from entity processing?

###### Files
    The name property for FileDomainModels is expected to include the extension.    
        API  and Ux validation is needed to ensure that the extension is always present.
            Can it be inferred from the Format?
    How will the Format property be used for Models, DepthBuffers and Meshes?
        Is it necessary if the file type can be found through reflection?
    How should the model name be held in the ModelViewer?
        The model.Name property is now 'Root' (Three).

###### Remove .gitignore filters on Test\Data folder?
    What is the practical limit for git binary files? Are the GitHub restrictions?


###### Review and organize the Postman tests.

#### API Design

    UX Requests
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Browser forms support only GET or POST.
                                                                                                                                                                                                                                                                                                                                                                         
    View            Operation               Note            HTTP            Endpoint                                Internal Request        Return
    ---------       ---------               ------------    ------------    ---------------------                   -----------------       -------------------------
    Index           read (collection)                       GET             /api/v1/resource                        GetList                 View; paged collection
    Details         read (single)                           GET             /api/v1/resource/details/id             GetSingle               View; JSON object
    Create          create                                  POST            /api/v1/resource                        PostAdd                 View; JSON object
    Edit            update                                  POST            /api/v1/resource/edit/id                Put                     View; JSON object
    Delete          delete                                  POST            /api/v1/resource/deleteconfirmed/id     Delete                  Index


    API Requests
    ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Format          Operation               Note            HTTP           Endpoint                                 Internal Request        Return
    ---------       ---------               ------------    ------------   ---------------------                    -----------------      -------------------------
    JSON            read (collection)                       GET            /api/v1/resource/id                      GetList                 OK; JSON collection
    JSON            read (single)                           GET            /api/v1/resource/id                      GetSingle               OK; JSON object
    JSON            create                                  POST           /api/v1/resource                         Post                    Created; new id returned and default metadata       
    JSON            update (full)                           PUT            /api/v1/resource/id                      Put                     OK; JSON object
    JSON            update (partial)                        PATCH          /api/v1/resource/id                      Patch                   OK; JSON object
    JSON            update (partial)                        PUT            /api/v1/resource/id/patch                Patch                   OK; JSON object
    JSON            delete                                  DELETE         /api/v1/resource/id                      Delete                  OK

    binary          read (single)                           GET            /api/v1/resource/id/file                 GetFile                 OK; octet-stream
    binary          create                  Mesh disallowed POST           /api/v1/resource/id/file                 PostFile                Created; new id returned and default metadata       
    binary          update (full)                           PUT            /api/v1/resource/id/file                 PutFile                 OK
    binary          update (partial)        no endpoint   
    binary          delete                                  DELETE         /api/v1/resource/id/File                 DeleteFile              OK

Add authentication support!

The Project is populating the object graph too deeply.

###### Enhancements
    Express relationships as "href" properties to absolute URLs.
    Provide "reference expansion" to allow references to be expanded into the principal object.

###### Stormpath Pattern 
    Rich error message:
        Status Code         HttpStatusCode                   
        Code                ApiErrorCode
        Message             Errors[]
        DeveloperMessage    DeveloperMessage   
        API Reference       ApiReference

#### Front End

    Create a ModelRelief JavaScript API library.
        Publish POCO models to JavaScript?
        Create a utility URL composer.

    File Transfer
        Use jQuery!
        Wait for file POST to complete before initiating the second metadata POST.

    async/await
        Refactor Export OBJ.

    Accessing Model From JavaScript
        https://stackoverflow.com/questions/16361364/accessing-mvcs-model-property-from-javascript

    Webpack

    Some Views are identical. Should they use a shared ViewComponent?
        Create, Edit
        Details, Delete

#### Logging
    Limit the size of the log file.

    Log ApiErrorResult?

    XUnit TestRunner Output
    https://github.com/marhoily/serilog-sinks-xunittestoutput

    Review the ILogger interface. How should this work with a Controller?
```c#
    namespace Microsoft.Extensions.Logging
    {
        //
        // Summary:
        //     A generic interface for logging where the category name is derived from the specified
        //     TCategoryName type name. Generally used to enable activation of a named Microsoft.Extensions.Logging.ILogger
        //     from dependency injection.
        //
        // Type parameters:
        //   TCategoryName:
        //     The type who's name is used for the logger category name.
        public interface ILogger<out TCategoryName> : ILogger
        {
        }
    }

```
#### StorageManager 
An ApplicationUser could have a storage folder property that is used by the StorageManager to define the default location.

#### DomainModel
    Format : Generalize the file format types.
        This complicates the UI presentation since incompatible file formats (e.g. OBJ for DepthBuffer) are bundled.

#### FileDomainModel 
    Casting from DomainModel to FileDomainModel can only be done when access to the specific type is not needed.
    PostFile
        var fileName = Path.Combine(storageManager.DefaultModelStorageFolder(domainModel), domainModel.Name);
        The resolution of a storage location depends on looking up the TEntity.Name as a resource.

#### Exception handling
    The ApiValidationResult exposes too much about internals in the developer message (RequestType).

    How should database exceptions, such as those violating Domain DataAnnotation rules, be handled?
    https://andrewlock.net/using-cancellationtokens-in-asp-net-core-mvc-controllers/
    Concurrency exceptions?

    SqliteException: SQLite Error 5: 'database is locked'.
        PostFileRequestHandler : DbContext.SaveChanges();

    Throwing policy.
        https://stackoverflow.com/questions/2999298/difference-between-throw-and-throw-new-exception        

#### Testing
    xUnit Async
        https://github.com/xunit/xunit/issues/1066

    Support database authentication.

    Integration Tests
        If all integration and unit tests are non-destructive, is it necessary to refresh the Test database from the Baseline?
            This does not work with SQLServer as it seems to maintain an exclusive file lock during DbInitializer execution.

        How can XUnit be used to test all properties of a resource?
            Iterate through the property list of a Domain model.

        Ux Endpoints                    
            Data must be form-encoded not JSON?
            The [ValidateAntiForgeryToken] attribute leads to an exception.

        Split Api and Ux into separate assemblies?
            Can the ServerFixture be in a separate assembly?

    Unit Tests                
        API Testing Mocks
            How can RouteNames.ApiDocumentation be registered as a route?
            Schema
            Host
            Port

#### Mediator

    Mediator Pipeline
        Should there be top-level logging and exception handling in a pipeline wrapper?
        https://codeopinion.com/fat-controller-cqrs-diet-command-pipeline/

#### Opinionated API
https://schneids.net/never-resting-restful-api-best-practices-using-asp-net-web-api/

    OAPI Design
        Benefits
            Paging
            PUT (partial property list) support
            GET populates related entities (ProjectTo)

        abstract ApiController
                HandleRequestAsync
            abstract RestController
                HttpGet
                HttpPost
                HttpPut
                HttpDelete
                <Model>Controller
                    overrides
                    extensions
                        Viewer

        abstract ValidatedHandler
            <Request>Handler

        abstract RequestValidator
            <Model><Request>Validator

        Pipeline
            Custom authentication middleware (Test)
                DbContextTransactionFilter.OnActionExecutionAsync
                    begin transaction
                        Validators (Model-binding before action method)
                            RestController HTTP Action
                                ApiController.HandleAsyncRequest
                                    var response = await Mediator.Send(request);
                                        ValidatatedHandler.Handle
                                            RequestHandler.Handle
                    end transaction
    
#### Autofac
    ASP.NET Core
    https://autofac.readthedocs.io/en/latest/integration/aspnetcore.html

    Example
    https://github.com/autofac/Examples/tree/master/src/AspNetCoreExample
   
#### AutoMapper
    The AutoMapper.QueryableExtensions ProjectTo will populate an object graph when used with a query. 
    Otherwise, navigation properties will be null.
        var result = await DbContext.Set<TEntity>()
                .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(m => m.Id == message.Id);

    Getting along with AutoMapper and Autofac
    https://kevsoft.net/2015/09/14/getting-along-with-automapper-and-autofac.html

#### Fluent Validation
    https://github.com/JeremySkinner/FluentValidation

#### REST API Best Practices
    e-Book on API Design

    Design Guidelines
        General
            https://blog.octo.com/en/design-a-rest-api/
            https://blog.octo.com/wp-content/uploads/2014/12/OCTO-Refcard_API_Design_EN_3.0.pdf
         Lowercase
            https://stackoverflow.com/questions/37423468/lowercase-urls-in-net-core-rc2
        Images
            https://stackoverflow.com/questions/33279153/rest-api-file-ie-images-processing-best-practices
        Documentation
            https://github.com/domaindrivendev/Swashbuckle.AspNetCore

        PUT, POST, PATCH
            https://stackoverflow.com/questions/630453/put-vs-post-in-rest
            https://stackoverflow.com/questions/28459418/rest-api-put-vs-patch-with-real-life-examples
            http://www.eq8.eu/blogs/36-patch-vs-put-and-the-patch-json-syntax-war

            PUT : complete
                The HTTP RFC specifies that PUT must take a full new resource representation as the request entity. 
                This means that if for example only certain attributes are provided, those should be remove (i.e. set to null).
            PATCH : partial

#### File Transfers
        JavaScript
            These solutions are for saving files on the client (not server) side.
                https://github.com/eligrey/FileSaver.js/
                https://github.com/jimmywarting/StreamSaver.js

#### Image processing

    Image File Creation
        ImageSharp
        Create a 16 bit PNG from the depth data.

    Images in ASPNET
        https://github.com/SixLabors/ImageSharp
        https://blogs.msdn.microsoft.com/dotnet/2017/01/19/net-core-image-processing/
        https://andrewlock.net/using-imagesharp-to-resize-images-in-asp-net-core-a-comparison-with-corecompat-system-drawing/

#### MVC

    Viewer.cshtml
        Models
            3D Model
            DepthBuffer (created by View settings)
            Mesh (created by mesh generation)

        Views
            ComposerView

            ModelView
                ModelViewer
                    ModelViewerControls
            MeshView
                MeshViewer
                    MeshViewerControls

        Controllers
            ComposerController
            (ModelController)
            (MeshController)

#### Viewer

    Progress Indicator
    OrbitControls versus Trackball
    Add MaterialLoader.

    Create a set of sample materials such as wood, glass, plaster, etc.

    Camera
        Why does the View change slightly after the 2nd Fit View?
            This happens only if the view has been <panned>.

#### Optimization
    Why is MeshValidator called several time during a Put request?

    Optimize BoundingBox procesing.

    Profiling
        Install additional IIS components?

    Memory management!
        https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec

#### ASPNET Core

#### VSCode Debugging Workflows

    Command Line
        FE: Chrome   BE: VSCode  TypeScript: automatic  Reload: automatic
            dotnet run
            gulp serve (automatic TypeScript/reload)
            VSCode Profile: .NET Core Attach
                Edit launch.json to set processId!

    VSCode Profile: .Net Core With Browser
        FE: VSCode   BE: VSCode  TypeScript: DNW  Reload: DNW

    VSCode Profile: .Net Core Launch (web)
        FE: Chrome   BE: VSCode  TypeScript: DNW  Reload: DNW

    VSCode Profile: .NET Core Attach
        Edit launch.json to set processId!
        https://github.com/OmniSharp/omnisharp-vscode/issues/897
        An error happens running the command below. It should open a UI to pick the process.
            D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief>wmic process get Name,ProcessId,CommandLine
            Invalid XML content.
    
    VSCode Resources
        https://stackoverflow.com/questions/43628397/debug-typescript-in-vscode-with-asp-net-core
        https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code


#### Depth Buffer Notes
    Experiment with precision setting in THREE.WebGLRenderer.

    Precision is substantially improved by moving the Near plane as close to the model as possible.
        Pulling in the Far plane does not seem to improve the precision.

    The range of the depth buffer is based on the distance between the Near and Far planes. 
        If the Near and Far planes bound the model, the range will be [0.1].

#### Database Design   

    Issues
        Analyze the correct behavior of OnDelete.
            Some dependent entities (e.g. Mesh) may potentially be deleted if the parent (e.g. DepthBuffer) is deleted.
        Referential Integrity!
        Should <all> entities have a direct relationship to Project or only "principal" entities.
            For example a Mesh is directly related to a Project but that relationship is also inditectly captured by Mesh->DepthBuffer->Model->Project.
        Should principal entities have a collection property that holds all children? These <can> be found with a query.
            For example:
                Project
                    Cameras
                    DepthBuffers
                    Meshes
                    Models
                    MeshTransforms

    https://stackoverflow.com/questions/33197402/link-asp-net-identity-users-to-user-detail-table

    Why are navigation properties virtual?
        https://stackoverflow.com/questions/25715474/why-navigation-properties-are-virtual-by-default-in-ef

    How can the database be backed up?
        Can it be relocated to another location?

    Phase II       
         Materials
            DomainModel

        Model3d
            Material
            LightingSetup

        LightingSetup
            DomainModel

        LightingSetupLights (join table)
            DomainModel
            Lighting ID
            Light ID
            A supporting join table is needed to connect a lighting configuration with the individual lights.

    SQL Server Studio
        Connnect to a locadb from Studio
        http://nikgupta.net/2015/12/10/connect-localdb-from-management-studio/

        C:\Program Files\Microsoft SQL Server\130\Tools\Binn
            λ SqlLocalDB.exe info MSSQLLOCALDB
            Name:               MSSQLLocalDB
            Version:            13.1.4001.0
            Shared name:
            Owner:              VECTOR\Steve Knipmeyer
            Auto-create:        Yes
            State:              Running
            Last start time:    9/19/2017 6:57:25 AM
            Instance pipe name: np:\\.\pipe\LOCALDB#9A6B632F\tsql\query

#### Database 
    Use UUID not sequential integer keys in database. This will scale better.

    SQLite
        Multi-user Access
            Cookies are used so tests must be done from an external computer.
        64 bit support

#### Git
    TBD

#### TypeScript

    How can a subclass call the property (method) of a super class?
        https://github.com/Microsoft/TypeScript/issues/4465
        ModelViewer extends Viewer
            set model (model : THREE.Object) {
                super.model(model);     // not valid
            }            

    TypeScript Typings management
        Where is the Visual Studio instance of node.s installed?
            "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Web Tools\External"
            Where are the Visual Studio (automatic) npm typings?
                C:\Users\Steve Knipmeyer\AppData\Local\Microsoft\TypeScript\node_modules\@types
                https://stackoverflow.com/questions/42663010/typescript-in-visual-studio-2017-automatic-definition-inclusion-causes-duplicat
                https://blogs.msdn.microsoft.com/visualstudio/2016/11/28/more-productive-javascript-in-visual-studio-2017-rc/
                    (Note: This feature is disabled by default if using a tsconfig.json configuration file

        var uint8Array = new Uint8Array((<any>fileDataObj.target).result);
            EventTarget does not contain a member result.
            https://github.com/Microsoft/TSJS-lib-generator/pull/207
            https://github.com/Microsoft/TypeScript/issues/299

#### HTML

    What is the correct use of user-scalable-no? Should it appear only on the Model Viewer page and not be included in the _Layout.cshtml?
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

    What is the asp-fallback-test for jquery-validation-unobtrusive?

    Why does jQuery need to be loaded before require.js (module mismatch error)?
        https://stackoverflow.com/questions/4535926/how-do-i-use-requirejs-and-jquery-together

#### Modules

    http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/

    What is the recommended way to split a module over multiple files?
        Using a d.ts file and 'export as namespace' works but it led to issues loading MR in require.js. 
            modelrelief.d.ts
                export as namespace MR

                export * from "fileA"
                export * from "fileB"

            MR is composed of multiple disk files. How is that handled with AMD modules in require.js?
                When TypeScript creates the AMD output, the module name is the disk file. There is no definition of MR as an aggregate.
                Is there a require.config that maps a module name to multiple separate modules?
                    MR -> fileA,fileB
            
            Can a module name have a period such as MR.Graphics?
                import * as MR.Graphics from "Graphics" led to an error.

            Can multiple modules be imported into the same alias? This construct is not valid.
                import * as MR from"Graphics"
                import * as MR from"Views"

#### THREE.js Notes

    Object clone <only> copies Object3d properties.

    Object matrices are updated only during the render loop. The property matrixAutoUpdate enables this update but not update the matrix when dependent properties are changed.
        Use Object3d.updateMatrixWorld(true) to force an update.

    A Group can belong to only one Scene.
        let sceneA   = new THREE.Scene();
        let theGroup = new THREE.Group();
        sceneA.add(theGroup);

        let sceneB = new THREE.Scene();
        sceneB.add(theGroup);

#### Technical Notes

    Base64 encoding for HttpRequest.
        https://github.com/beatgammit/base64-js
        https://github.com/hughsk/tab64
    
    How is byte ordering (little/big endian) handled in HTTP requests?
        http://calculist.org/blog/2012/04/25/the-little-endian-web/

    MultiPart Form
        https://stackoverflow.com/questions/3938569/how-do-i-upload-a-file-with-metadata-using-a-rest-web-service

        https://stackoverflow.com/questions/4083702/posting-a-file-and-associated-data-to-a-restful-webservice-preferably-as-json
        https://stackoverflow.com/questions/30655582/uploading-files-and-json-data-in-the-same-request-with-jquery-ajax

        https://stackoverflow.com/questions/43674504/multipart-form-data-file-upload-in-asp-net-core-web-api

    MIMETypes
        Similarly, for binary documents without specific or known subtype, application/octet-stream should be used.

#### Licenses
    THREE.js        MIT
    Serilog         Apache https://www.apache.org/licenses/LICENSE-2.0
    Autofac         MIT
    MediatR         Apache https://github.com/jbogard/MediatR/blob/master/LICENSE
    FeatureFolders  MIT https://raw.githubusercontent.com/OdeToCode/AddFeatureFolders/master/LICENSE

    OpinionatedApiController : Spencer Schneidenbach
    ContosoCore              : Jimmy Bogard

#### Visual Studio 
    Performance
        https://developercommunity.visualstudio.com/content/problem/43364/visual-studio-2017-increadibly-slow-and-laggy.html
    Private Hive
    https://stackoverflow.com/questions/42916299/access-visual-studio-2017s-private-registry-hive

#### Identity
    https://andrewlock.net/introduction-to-authentication-with-asp-net-core/

#### ASP.NET Core Model Validation
    https://github.com/JeremySkinner/FluentValidation/wiki/i.-ASP.NET-Core-integration

##### Best Practices
    DataAnnotation rules also should be used for DTO.
        They <complement> FV. They (and any other registered validators) run after FV.
        They provide display formatting and other UX support.
    The Domain models should also use DataAnnotation attributes. 
        Validation will be done when a model (created OUTSIDE) the UX is transacted with the database.
        This happens as a part of model-binding.
    The DTO should expose only those properies which are editable!
        Missing properties in the View will override the target during mapping because they will have a default value.

---
###### Client-side Validation
    The View model (e.g. Dto.Mesh) determines the client-side validation rules.
        Any associated validators for this specific type will run.

    DataAnnotation Attributes
        Property ON form: A client-side error will be displayed and the controller action will not be called.
        Property not present on form: Validation will be done in the server IF the model-bound action parameter contains a validation rule. 
            ModelState will contain errors when the controller action is called.

        N.B. ContosoUniversityCore uses server-side validation (in conjunction with site.js and HtmlHelperExtensions error handling). 
            Any DataAnnotation attributes on the DTO are ignored. No data-val attributes are added to the View.
                Is this because the jquery-validation-unobtrusive scripts are not include in the View page?
            If a DataAnnotation rule was violated (e.g. [Required]) and there was no FluentValidation (AbstractValidator rule), the property was not marked as invalid.
            * This seems odd because although the form did not contain the client-side validation attributes, why did MVC not validate the object on the incoming model-bound object?
                Is this due to the custom model-binding?
            However, if the Domain model contains DataAnnotation attributes these are processed when the model is transacted to the database.

        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; }

    Aggregating Validation Rules
        If View model implements any of these interfaces then additional validation checks will be added the complete list of checks, adding additional results to ModelState.
            FluentValidation.AbstractValidator<T> : (runs first by default)
            DataAnnotation
            IValidatableObject 
        N.B. These are all used by a View if present! Each of these validations contribute rules (in the form of data-val attributes) that are used in the client-side processing.
    
###### Server-Side Validation
    The controller action parameters (e.g. Create.Command) control the server-side validation rules.
        Any associated validators for this specific type will run.
        This happens during model-binding.

    Model-binding maps the Request.Body, route data and query strings to the parameters of the controller action. 
        By default, MVC supports a limited number of formatters.

    All validation providers can contribute rules to the validation.
        DataAnnotation Attribute
        IValidatable
        FluentValidation

    ValidationActionFilter
        If an ActionFilter is registered, control passes there.
            The ActionFilter can check ModelState.Valid and then set the ActionExecutingContext.Result so the controller action is never called.
    
    Finally, the controller action is invoked.
---

    Can the request handlers share common validation code?
                                Entity Exists   StorageFolder   File Exists     Formatting
        GetSingle               X                                               X
        GetList                                                                 X

        Delete                  X               
            DeleteStorage                       X               X
        Put                     X                                               X
        Patch                   X                                               X
        GetFile                 X               X               X

        Post                                                                    X
        PostFile                                X                               X

#### Variance

###### Invariance
    The types must match exactly.

###### Covariance (out parameters) : More Derived
    public interface IEnumerable (out T)

    A more derived type can be substituted.
    The parameter can be returned because it satisfies the type because it is of type Base.

###### Contravariance (in parameters) : Less Derived
    public interface IComparer<in T>

    A less derived type can be substituted.
    When the method is called, the <actual> parameter passed to the method will be <more derived> so it will satisfy the type of the actual method that is invoked.

#### Tasks

        // prevent async (no await) warning
        //https://stackoverflow.com/questions/44096253/await-task-completedtask-for-what
```c#
        await Task.CompletedTask;
```

#### ContosoUniversity Core
    Why is the project named "Core" when it has these dependencies? 
        AutoMapper.EF6
            EntityFramework 6.13

    Why does Delete display the JSON ContentResult instead of the IndexView?
        The site.js file includes a jQuery call back on all form post submits.
        site.js provides client-side error validation.

    How is the ContosoUniversityCore model binding used?
        public class EntityModelBinder : IModelBinder
        It binds a database <model> looked up from the incoming Id.

#### Cmder
    ModelReliefShell.bat is started through this batch file located in D:\Users\Steve Knipmeyer\Documents\Bin\cmder\config\profile.d:
        StartModelReliefShell.bat
            "D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief\Tools\ModelReliefShell.bat"

#### New Computer Setup
    The Test files are not restored from Git because some (e.g. .obj) are excluded by .gitignore.
    gulp must be installed globally.
        npm install --global gulp-cli
    Unit tests require running Baseline.py after running ModelRelief.Test to create the initial Test database.
    node must be installed.

#### Authentication and Authorization            
    https://odetocode.com/blogs/scott/archive/2017/02/06/anti-forgery-tokens-and-asp-net-core-apis.aspx

    https://stackoverflow.com/questions/40351870/asp-net-core-custom-authentication-tying-request-to-user

#### C#
    Conversion of List of derived class to the base class.
        // https://stackoverflow.com/questions/1817300/convert-listderivedclass-to-listbaseclass
        dependentModels = new List<DomainModel>(candidateDependentModels).ConvertAll(m => (DomainModel)m);
    
    Using reflection to call a generic method:
        // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
        // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
        var method = typeof(ValidatedHandler<TRequest, TResponse>).GetMethod(nameof(ModelExistsAsync)).MakeGenericMethod(referenceType);
        var modelExists = await (Task<bool>)method.Invoke(this, new object[] {claimsPrincipal, (int) propertyValue});
