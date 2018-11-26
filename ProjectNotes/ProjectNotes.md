### Tasks
#### Commit Notes

#### Lambda

#### Vector

#### Test Checklist
    Test Checklist
        Visual Studio
            IIS Express launch
        testrunner (XUnit)          python Tools\testrunner.py
        Builder
            Development             python.exe Build\Builder.py --target local
            IIS                     python.exe Build\builder.py --target IIS --deploy True
            Docker                  python.exe Build\builder.py --target Docker
        Postman
        Explorer                    python.exe Explorer\explorer.py --s ../Solver/Test/Lucy.json --w ../Solver/Test/Working
        Solver                      python Solver\solver.py --s "Test/House.json" --w "Test/Working"
        Docker                      DockerStart

#### Short Term
    Knald license.
    Evauluate silouette properties of existing algorithm.
    Explore
        Awesome Bump
        Knald
        xNormal
        ShaderMap
        Gimp Normal Plugin

    Core
        Should clipping planes be set based on the Model?

        Close in Orthogonal views of House (Lambda: Documents\Temp\MalformedHouse) yield malformed meshes.

        Visually examine randomly-generated cameras that have been round-tripped.

        Experiment with Poisson solutions of images that have not been attenuated/processed.
        Develop test models to test the gaussian filter mask processing.
            The model should contain details near the edges (adjacent to the background) and near thresholded regions.
                Spheres (Positive, Negative)
                Cubes
                Architectural

        Chrome "paused before potential out-of-memory crash".
            https://stackoverflow.com/questions/42110726/chrome-devtools-paused-before-potential-out-of-memory-crash
            https://developers.google.com/web/tools/chrome-devtools/memory-problems/

    UI
        Add favicon.ico support.
        Add UI progress indicator for mesh generation.
        CameraControls
            Separate the Perspective controls into a separate dat.gui controller that can be entirely hidden or shown.
                Field of View

    Build a Python installer package for Explorer.

    Silhouette
        https://stackoverflow.com/questions/17161088/how-to-refine-or-blur-or-smooth-just-the-edges

    Should the Python image masks be integers or booleans (instead of doubles)?

    Three.js
        Update OBJLoader.ts.

    Why are there different versions of vc and vs2015_runtime between devenv and mrenv?
        devenv
            vc                        14.1                 h0510ff6_3
            vs2015_runtime            15.5.2                        3
        mrenv
            vc                        14                            0    conda-forge
            vs2015_runtime            14.0.25420                    0    conda-forge

    Technical Review
        Review the Blender implementation.
            What were the pre-processing steps that were done to prepare the data for the Poisson solver?
        Review the technical papers.
        Review ZSurf.
        Review ArtCAM.

    Runtime Settings
        https://medium.freecodecamp.org/environment-settings-in-javascript-apps-c5f9744282b6
        minifiedExtension
        loggingEnabled

    Performance
        The transfer of models is inefficent because they are Base64 encoded.

    Builder
        Add a model list to control which models are added.

    Order a SQLServer book.
    Order a git book.

    Register for A2 hosting.

    Investigate workspaces in VSCode.
        Why is the second workspace unnamed?

    Solver
        Meshes are not oriented correctly in Mayavi Isometric views.

        How can the mayavi log be viewed?

    Explore Python unit tests.

    3D Surface Visualization
        https://jakevdp.github.io/PythonDataScienceHandbook/04.12-three-dimensional-plotting.html

    Update database schema diagram.

###### StandardView
When the view camera is interactively changed, it should invalidate the StandardView in the UI.
    Mesh view opens with the UI set to StandardCamera.Front but the view is Top.

##### Technical Education

- ASP.NET Core in Action

#####  Lambda
    npm i alm -g

#####  Ubuntu
    Ignore line endings in git source.
    %TEMP% is not defined so the log file is created as %TEMP%\Logs\ModelRelief.log.
    Shift-End does not work in the editor to select from the cursor position to EOL.
    tsc command line
        Does the compiler need to be symbolically linked to a bin folder (e.g. usr/bin)
    SQLite
        The version is 2.87 on Ubuntu and 5.0 on Windows.
    The (PowerShell?) language service could not be started.
    Python 3.X
    ModelReliefShell.sh
        MRPort, MRPortSecure, ASPNETCORE_URLS, ASPNETCORE_HTTPS_PORT
        Review other runtime environment variables.
    How should the appsettings.json files define the directory separator. Forward slash does not work with SQLServer.
        Does forward slash work with SQLite on Windows?
    Install a SQLite administration tool.

#### Front End
<span style="color:red">
    The 'dotnet run' workflow runs as 'Production'!
</span><br><br>

##### FE UI
https://stackoverflow.com/questions/48244675/use-matplotlib-with-pyqt5-in-jupyter-notebook

A default relief size of 1024 leads to a Chrome exception.

How does EF and AutoMapper handle object graphs (with populated navigation properties) during updates?

What controls are (ultimately) present in Composer?
 - Model: models/?project=id
 - Mesh: meshes/?projectId=activeProjectId & model3dId=activeModel3dId
 -
Namimg
    FE uses depthbuffers while API uses depth-buffers.

Some Views are identical. Should they use a shared ViewComponent?
    Create, Edit
    Details, Delete

##### FE Model Structure

    DTO objects are used for DATA TRANSFER to the server, either through web page endpoints or the API.
        So, a web page is not bound to use a DTO *object* if the page does not use POST/PUT, etc.

    DepthBuffer
        Width, Height : Should this be a calculated property based on the image/ raw file format?

    MeshTransform
        Height : Should this be a calculated property?
            Height = Width * (DepthBuffer aspect ratio)?
        Depth : What is the relationship of this property to LambdaLinearScaling?

##### Camera Issues

- [ ] The quaternion and up vector do not roundtrip although the visual camera appears unchanged.  The matrix and projectionMatrix are unchanged!
- [ ] Randomly generated cameras do not roundtrip the matrix property.
- [ ] Add snapping to model vertices to set center of rotation. The center of rotation is the camera lookAt point.

Perspective <-> Orthographic
    The new view does not match the previous view.
    Fit View is used after the conversion.

##### Clipping Plane Issues

    Investigate why the clipping plane CameraControls are not editable.
        Could the events be intercepted by the TrackBall?
    Does repeated adjustment of the clipping planes leads to bad mesh results?
    Should the near clipping plane always be adjusted to the front extent?

<div style="font-size:9pt">

### Schema Modifications
#### Front End
- [X ] Add the new properties to the DTO interfaces, eg. IDepthBuffer.
- [X] Add the new properties to the DTO classes, eg. Dto.DepthBuffer.
- [X] Razor Pages
- [X] Include the new (required) properties in any POST requests.
- [X] Extend the Composer UI to include the new properties.
- [X] Modify the graphics class methods fromDto and toDto.

#### Back End

##### Domain Models
- [x] Add new properties to the class in the Domain folder.

##### DTO Models (Features\\\<Models>)
- [x] Add new properties to the class.
- [x] Extend the AbstractValidator\\\<Model> to add new validation rules for the properties.

##### DbInitializer
- [x] Add the properties to the instance initializers of the Add\<Model> methods.

##### Database
- [x] Delete the auto-generated classes from the Migrations folder.
- [x] From the ModelRelief\ModelRelief project folder, create the initial migration: **dotnet ef migrations add InitialCreate**
- [x] Add // \<auto-generated /\> to auto-generated files as necessary.

##### Explorer (MeshTransform only)
- [x] Add the new MeshTransform properties to the UI.

##### Solver (MeshTransform only)
- [x] Add the enable<Property> settings to allow the property to be enabled or disabled during processing.

##### Testing
- [x] Add the new properties to the ConstructValidModel method of the \<Model>TestModelFactory class.
- [x] Run the unit tests.
- [x] Update the test JSON files using MRUpdateSeedData.

##### Schema
- [x] Update ModelRelief.dgml schema diagram.
___

### Front End (JavaScript)

#### Interfaces

The FE DTO interfaces are used to facilitate construction of DTO models from HTTP.

|Graphics||DTO (HTTP)|
|--|---|---|
|||--|
|||IModel||
|||IFileModel||
|||IGeneratedFileModel||
||
|||ICamera||
|||IDepthBuffer||
|||IMesh||
|||IMeshTransform||
|||IModel3d||
|||IProject||

**DTO**
```javascript
export interface IModel
export interface IFileModel extends IModel
export interface IGeneratedFileModel extends IFileModel

export interface ICamera extends IModel
export interface IDepthBuffer extends IGeneratedFileModel
export interface IMesh extends extends IGeneratedFileModel
export interface IMeshTransform extends IModel
export interface IModel3d extends IFileModel
export interface IProject extends IModel
```

#### Base Classes
DTO models are in an inheritance chain so they can share common functionality such as API HTTP requests.

|Graphics||DTO (HTTP)|
|--|---|---|
|Model||Dto.Model|
|FileModel||Dto.FileModel|
|GeneratedFileModel||Dto.GeneratedFileModel|

**Graphics**
```javascript
export class Model implements IModel
export class FileModel extends Model<T> implements IFileModel
export class GeneratedFileModel extends FileModel<T> implements IGeneratedFileModel
```
**DTO**
```javascript
export class Model<T extends IModel> implements IModel
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel
```

#### Concrete Classes

|Graphics |Implementation||DTO (HTTP) |Implementation||Notes|
|---|---|---|---|---|---|---|
|Camera|IModel<br>Model||Dto.Camera|IModel, ICamera<br>Dto.Model||THREE.Camera|
|DepthBuffer|IGeneratedFileModel<br>GeneratedFileModel||Dto.DepthBuffer|IGeneratedFileModel, IDepthBuffer<br>Dto.GeneratedFileModel||
|Mesh|IGeneratedFileModel<br>GeneratedFileModel||Dto.Mesh|IGeneratedFileModel, IMesh<br>Dto.GeneratedFileModel||THREE.Mesh|
|MeshTransform|IModel<br>Model||Dto.MeshTransform|IModel,IMeshTransform<br>Dto.Model|||
|Model3d|IFileModel<br>FileModel||Model3d|IFileModel,IModel3d<br>Dto.FileModel||THREE.Mesh|
|Project|IModel<br>Model||Dto.Project|IModel, IProject<br>Dto.Model||


**Graphics**
```javascript
export class Camera extends Model
export class DepthBuffer extends GeneratedFileModel
export class Mesh extends GeneratedFileModel
export class MeshTransform extends Model
export class Model3d extends FileModel
export class Project extends Model
```
**DTO**
```javascript
export class Camera extends Model<Camera> implements ICamera
export class DepthBuffer extends GeneratedFileModel<DepthBuffer> implements IDepthBuffer
export class Mesh extends GeneratedFileModel<Mesh> implements IMesh
export class MeshTransform extends Model<MeshTransform> implements IMeshTransform
export class Model3d extends FileModel<Model3d> implements IModel3d
export class Project extends Model<Project> implements IProject
```

___
### Back End (NET Core)

#### Interfaces

|DTO (HTTP)||Domain (DB)|
|---|---|---|---|---|---|---|
|Dto.IModel|||
|Dto.IFileModel|
|Dto.IGeneratedFileModel|

**DTO**
```csharp
public interface IModel
public interface IFileModel : IModel
public interface IGeneratedFileModel : IFileModel
```

#### Base Classes
Domain models are in an inheritance chain so they can share common functionality such as file operations.
<span style="color:red">
Implementing a hierarchy of DTO models creates potential issues with DataAnnotation attributes sucn as Display(Name).
</span>

|DTO (HTTP)||Domain (DB)|
|--|
|||Domain.DomainModel|
|||Domain.FileDomainModel|
|||Domain.GeneratedFileDomainModel|

**Domain**
```csharp
public abstract class DomainModel
public abstract class FileDomainModel : DomainModel
public abstract class GeneratedFileDomainModel : FileDomainModel
```


#### Concrete Classes

|DTO (HTTP) |Implementation|Notes||Domain Models (DB) |Implementation|
|---|---|---|---|---|---|---|
|Dto.Camera|Dto.IModel|||Domain.Camera|DomainModel|
|Dto.DepthBuffer|Dto.IGeneratedFileModel|||Domain.DepthBuffer|GeneratedFileDomainModel|
|Dto.Mesh|Dto.IGeneratedFileModel|||Domain.Mesh|GeneratedFileDomainModel|
|Dto.MeshTransform|Dto.IModel|||Domain.MeshTransform|DomainModel|
|Dto.Model3d|Dto.IFileModel|||Domain.Model3d|FileDomainModel|
|Dto.Project|Dto.IModel|||Domain.Project|DomainModel|
|||||

**DTO**
ModelReliefFeatures
```javascript
public class Camera : IModel
public class DepthBuffer : IGeneratedFileModel
public class Mesh : IGeneratedFileModel
public class MeshTransform : IModel
public class Model3d : IFileModel
public class Project : IModel
```
**Domain**
 ModelRelief\Domain
```csharp
public class Camera : DomainModel
public class DepthBuffer  : GeneratedFileDomainModel
public class Mesh : GeneratedFileDomainModel
public class MeshTransform : DomainModel
public class Model3d : FileDomainModel
public class Project : DomainModel
```
___
</div>

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

#### Python Build
    https://developer.microsoft.com/en-us/windows/downloads/sdk-archive
        10.0.15063.0
    Python-3.6.6 source
    Change Solution Configuration to Debug x64.
    Change target architecture to Windows SDK 10.0.15063.0.
    build -p x64 -e

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

###### Files
File Formats
|Extension|Description|
|--|---|
|sdb|Single Precision Depth Buffer|
|ddb|Double Precision Depth Buffer|
|sfp|Single Precision Floating Point|
|dfp|Double Prevision Floating Point|

    The name property for FileDomainModels is expected to include the extension.
        API  and Ux validation is needed to ensure that the extension is always present.
            Can it be inferred from the Format?
    How will the Format property be used for Models, DepthBuffers and Meshes?
        Is it necessary if the file type can be found through reflection?
    How should the model name be held in the ModelViewer?
        The model.Name property is now 'Root' (THREE).

###### Review and organize the Postman tests.

---
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


#### Architecture
    How should byte-ordering (BigEndian, LittleEndian) be handled?
        Are some devices (e.g. phones) BigEndian?


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

A Put (File) request returns Created instead of OK. The file is correctly replaced but the status should be OK.

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

#### Error Handling
    This is the error handling control flow:
        RestController:ApiController
            Mediator.Send
                ApiValidationException
                EntityNotFoundException
                ModelFileNotFoundException              API only
                ModelNotBackedByFileException           API only
                UserAuthenticationException
                Exception
            These exceptions are <caught> and then converted into an ApiErrorResult where they are returned to the caller with no further processing.
            <No> exception is propagated further.

        ViewController:UxController
            NullRequestException                        null request; Ux only
            Mediator.Send
                ApiValidationException
                EntityNotFoundException
                UserAuthenticationException
                Exception
            These exceptions are thrown and then caught by GlobalExceptionFilter.OnException.

        GlobalExceptionFilter.OnException
            This logic is active only <outside> Development. Otherwise, the Developer exception pages are used.
            Sets the status code depending on the type of exception.
            Marks the exception as <handled>.
            Returns a StatusCodeResult which then flows to app.UseStatusCodePagesWithReExecute.
                    NullRequestException            HttpStatusCode.BadRequest
                    EntityNotFoundException         HttpStatusCode.NotFound
                    UserAuthenticationException     HttpStatusCode.Unauthorized;

        /Errors/Error/?statusCode={0}
            This controller action is called through UseStatusCodePagesWithReExecute.
            https://andrewlock.net/re-execute-the-middleware-pipeline-with-the-statuscodepages-middleware-to-create-custom-error-pages/
                    HttpStatusCode.BadRequest       BadRequest.cshtml
                    HttpStatusCode.NotFound:        NotFound.cshtml
                    default                         Error.cshtml

#### Logging
    How can ModelRelief messages be associated with a category (e.g. 'Microsoft')?

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

    Investigate chai for FE JavaScript testing.

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
            Custom authentication middleware (e.g. Test [now deprecated])
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

#### Model Loaders
    The OBJLoader does not handle Bones.
        Could this be resolved in a later version of Three.js?

#### Viewer
    Large Models
        Design: Should all models be scaled to fit within the default view frustrum?
            Are Meshes unitless? How will a (pixel-based) mesh be scaled to real world units?
        If a model is too large (on the order of the default far clipping plane), the views are malformed.
            Fit View may not work because it calculates only the clip planes.
                <It also needs to calculate the camera position.>
            The UI CameraControls need to be set based on the dimensions of the model.
        Camera position now is always based on the loaded Camera DTO.
            Support needs to be added to set a camera position for a brand new model (for which no Camera DTO exists).

    Transform Control
        This would allow the model to be positioned instead of the camera to set up the scene with much more control.

    Progress Indicator
    OrbitControls versus Trackball
    Add MaterialLoader.

    Provide keyboard support in UI settings.
        https://github.com/dataarts/dat.gui/issues/179
        The dat-gui listen() method blocks keyboard input in the text field.

    Create a set of sample materials such as wood, glass, plaster, etc.

    Pan
        Camera translations are not handled correctly.

    Camera
        Why does the View change slightly after the 2nd Fit View?
            This happens only if the view has been <panned>.

####Shaders
    Gradients are calculated from the DepthBuffer which directly reflects the faceting of the model.
        Could the DepthBuffer use the fragment shader which has interpolated vertex coordinates?

#### Optimization
    Why is MeshValidator called several time during a Put request?

    Optimize BoundingBox procesing.

    Profiling
        Install additional IIS components?

    Memory management!
        https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec

#### ASPNET Core

#### VSCode Issues
    How can the C# style checker be manually run in VSCode?
        https://github.com/OmniSharp/omnisharp-vscode/issues/43

    Why does the VSCode Python debugger not find modules in other folders?
        This happens only in the debugger.
        Adding .env to the workspace root resolves the issue.
            PYTHONPATH=.
                The causes the entire OS env PYTHONPATH to be added to the search path.

    Why is the Python refactoring so slow?
        "Refactoring library rope is not installed. Install?"

#### VSCode Debugging Workflows

    Command Line
        FE: Chrome   BE: VSCode  TypeScript: automatic  Reload: automatic
            dotnet run
            gulp serve (automatic TypeScript/reload)
            VSCode Profile: .NET Core Attach
                Edit launch.json to set processId!

                https://github.com/OmniSharp/omnisharp-vscode/issues/897
                An error happens running the command below. It should open a UI to pick the process.
                    D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief>wmic process get Name,ProcessId,CommandLine
                    Invalid XML content.

    VSCode Profile: .Net Core With FE Debugging in VSCode
        FE: VSCode   BE: VSCode  TypeScript: DNW  Reload: DNW

    VSCode Profile: .Net Core Launch
        FE: Chrome   BE: VSCode  TypeScript: DNW  Reload: DNW

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
    Git Configuration: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
    git config --list

|Configuration File|Linux|Note|Windows|Note
|----|----
|system|/etc/gitconfig||C:\Program Files\Git\etc\gitconfig|none
|system|||C:\ProgramData\Git\config
|user|~/.gitconfig||C:\Users\$USER\\.gitconfig
|user|~/.config/git/config|
|project|.git/config||.git\config

    Investigate Git large file storage.
        D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief>git push
        Counting objects: 82, done.
        Delta compression using up to 12 threads.
        Compressing objects: 100% (61/61), done.
        Writing objects: 100% (82/82), 45.99 MiB | 1.78 MiB/s, done.
        Total 82 (delta 34), reused 0 (delta 0)
        remote: Resolving deltas: 100% (34/34), completed with 12 local objects.
        remote: warning: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
        remote: warning: See http://git.io/iEPt8g for more information.
        remote: warning: File ModelRelief/Test/Data/Users/models/roadster/roadster.obj is 62.69 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
        remote: warning: File ModelRelief/Test/Data/Users/models/statue/statue.obj is 89.36 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
        To https://github.com/steveknipmeyer/ModelRelief.git
        effd8c2..a3274da  master -> master

###### git submodules
    http://www.vogella.com/tutorials/GitSubmodules/article.html
    https://git-scm.com/book/en/v2/Git-Tools-Submodules

    (Development) D:\ModelRelief\Relief\lib>git submodule add -b master https://github.com/pybind/pybind11.git
    Cloning into 'D:/ModelRelief/Relief/lib/pybind11'...
    remote: Counting objects: 10102, done.
    remote: Total 10102 (delta 0), reused 0 (delta 0), pack-reused 10102
    Receiving objects: 100% (10102/10102), 3.67 MiB | 6.00 MiB/s, done.
    Resolving deltas: 100% (6820/6820), done.
    warning: LF will be replaced by CRLF in .gitmodules.
    The file will have its original line endings in your working directory.

    git submodule init
    git submodule update

###### git branch
    (Development) d:\Github\ModelRelief>git status
    On branch orthographic
    Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

            modified:   ModelRelief/Domain/Camera.cs
            modified:   ModelRelief/Features/Cameras/Camera.cs
            modified:   ProjectNotes/ProjectNotes.md

    no changes added to commit (use "git add" and/or "git commit -a")

    (Development) d:\Github\ModelRelief>git add .

    (Development) d:\Github\ModelRelief>git commit -m "Extend Camera DTP and Domain models with Orthographic properties."
    [orthographic 46e1a7c] Extend Camera DTP and Domain models with Orthographic properties.
    3 files changed, 80 insertions(+), 19 deletions(-)

    (Development) d:\Github\ModelRelief>git push
    fatal: The current branch orthographic has no upstream branch.
    To push the current branch and set the remote as upstream, use

        git push --set-upstream origin orthographic


    (Development) d:\Github\ModelRelief>git push --set-upstream origin orthographic
    Enumerating objects: 50, done.
    Counting objects: 100% (50/50), done.
    Delta compression using up to 4 threads.
    Compressing objects: 100% (27/27), done.
    Writing objects: 100% (28/28), 3.00 KiB | 768.00 KiB/s, done.
    Total 28 (delta 21), reused 0 (delta 0)
    remote: Resolving deltas: 100% (21/21), completed with 18 local objects.
    remote:
    remote: Create a pull request for 'orthographic' on GitHub by visiting:
    remote:      https://github.com/steveknipmeyer/ModelRelief/pull/new/orthographic
    remote:
    To https://github.com/steveknipmeyer/ModelRelief.git
    * [new branch]      orthographic -> orthographic
    Branch 'orthographic' set up to track remote branch 'orthographic' from 'origin'.

    (Development) d:\Github\ModelRelief>git status
    On branch orthographic
    Your branch is up to date with 'origin/orthographic'.

    nothing to commit, working tree clean

#### TypeScript
    TypeScript Installations
        VSCode
        TypeScript SDK
        node-typescript(?)

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
    THREE.js                    MIT
    Serilog                     Apache https://www.apache.org/licenses/LICENSE-2.0
    Autofac                     MIT
    MediatR                     Apache https://github.com/jbogard/MediatR/blob/master/LICENSE
    FeatureFolders              MIT https://raw.githubusercontent.com/OdeToCode/AddFeatureFolders/master/LICENSE
    http-status-codes           MIT https://www.npmjs.com/package/http-status-codes
    base64                      MIT https://github.com/beatgammit/base64-js/blob/master/index.js
    OpinionatedApiController : Spencer Schneidenbach
    ContosoCore              : Jimmy Bogard

    Model                                       Project         Source      License             Link
    Armadillo                                   Stanford        Stanford
    Buddha                                      Stanford        Stanford
    Bunny                                       Stanford        Stanford
    Dolphin                                     Jewelry         TurboSquid  RoyaltyFree         https://www.turbosquid.com/FullPreview/Index.cfm/ID/332975
    Dragon                                      Stanford        Stanford
    House (San Francisco)                       Architectural   TurboSquid  RoyaltyFree         https://www.turbosquid.com/FullPreview/Index.cfm/ID/832520
    Lucy                                        Stanford        Stanford
    Roadster (Duesen Bayern Mystar 190 SL)      Jewelry         TurboSquid  Editorial(None)     https://www.turbosquid.com/3d-models/free-duesen-bayern-mystar-190-3d-model/1062796
    Statue                                      Stanford        Stanford
    Test                                        ModelRelief     Internal
    Tyrannosaurus                               Stanford        Stanford

    Gaussian Box Blur           MIT https://www.peterkovesi.com/matlabfns/citesite.html
       Ivan Kutskir                 http://blog.ivank.net/fastest-gaussian-blur.html

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
    When the contravariant method/delegate parameter is called, the <actual> parameter passed to it will be <MORE derived> so it will satisfy the expected type.
    https://stackoverflow.com/questions/4669858/simple-examples-of-co-and-contravariance
```c#
        void DoSomethingToAFrog(Action<Frog> action, Frog frog)
        {
            action(frog);
        }
        ...
        Action<Animal> feed = animal=>{animal.Feed();}
        DoSomethingToAFrog(feed, new Frog());
        // Here Frog is an Animal so Animal.Feed can accept a Frog.
```
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

#### ASPNET Core Environment Variables
Environment variables set in the Visual Studio launchSettings.json **override** environment variables set in the shell.
The Visual Studio Debug project settings for Environment variables **writes through** to launchSettings.json. They are *identical*.

The XUnit tests cannot be run withany required prompts for user verification because *the console is not displayed*.
ServerFramework (WebHost.CreateDefaultBuilder) sets the environment to "Development" *however the environment variables from launchSettings.json are not used.*

#### New Computer Setup
    gulp must be installed globally.
        npm install --global gulp-cli
    node must be installed.

#### C#
    Conversion of List of derived class to the base class.
        // https://stackoverflow.com/questions/1817300/convert-listderivedclass-to-listbaseclass
        dependentModels = new List<DomainModel>(candidateDependentModels).ConvertAll(m => (DomainModel)m);

    Using reflection to call a generic method:
        // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
        // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
        var method = typeof(ValidatedHandler<TRequest, TResponse>).GetMethod(nameof(ModelExistsAsync)).MakeGenericMethod(referenceType);
        var modelExists = await (Task<bool>)method.Invoke(this, new object[] {claimsPrincipal, (int) propertyValue});

#### NPM Package Manager
https://semver.npmjs.com/

    Why does node_modules use three 0.86 when package.json specifies ^0.86 which should admit 0.89 as the latest version.
    It seems that a leading zero for the major version is ignored and only the 2nd and 3rd fields are processed.

#### Adding a New Test Model
    Add the 3D model to D:\Users\Steve Knipmeyer\Documents\Development\ModelRelief\Models.

    Create a new folder in the source location for test models.
        D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\ModelRelief\Test\Data\Users\models
    Add the .OBJ and the material file .mtl.

    Update DbInitializer:
        [X] AddModels
        [X] AddMeshTransform
        [X] AddDepthBuffers
        [X] AddCameras
        [X] AddMeshes

        In ModelRelief, open the new model and generate a relief.
        Add the generated DepthBuffer and Mesh from the store folder to ModelRelief\Test.
        Update the Camera settings in DbInitializer with the updated Camera properties as shown in the Camera page.

#### Numpy

**Benchmarks (512x512 Array)**
|Operation|Numpy Time|Python Time |Ratio|Note|
|-|-|-|-|-|
|Gradient|0.00550|47.7558|10,000|
|Scale Floats|0.02|4.5|2,250|
|Copy|0.00||
|Vectorize Function|0.11|||Attenuation|
|Finite Difference|.002|0.2315|100|Attenuation|


#### WSL
    The Ubuntu (Windows App Store installation) is located here:
        C:\Users\Steve Knipmeyer\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\LocalState\rootfs
    Caveats:
        https://blogs.msdn.microsoft.com/commandline/2016/11/17/do-not-change-linux-files-using-windows-apps-and-tools/

#### Mayavi
        pip install mayavi
        pip install --upgrade --force-reinstall mayavi

#### FileGenerateReqquest
    A GenerateFileRequest is queued when:
        FileIsSynchronized : False -> True
        No FileTimeStamp change (avoiding a POST false positive)

    DepthBuffer does not implement FileGenerateRequest now because there is no means to generate a new DepthBuffer on the backend.
        Later, there could be a case for generating DepthBuffers on the server to allow completely API-driven workflows.

    N.B. GeneratedFile models held in memory (e.g. DepthBuffer in ComposerController) do not have the FileIsSynchronized property updated (invalidated) after a dependency (e.g. Camera) has been modified.
        Therefore, the ComposerView instances of DepthBuffer, Mesh do not accurately reflect the state of FileIsSynchronized in the database.
        So, ComposerController explicitly sets FileIsSynchronized before a GeneratedFileModel update (PUT) to express the intent.

#### Docker
    Issues
        Docker container cannot configure HTTPS.
            The certification must be made available in the container.
            https://github.com/aspnet/Docs/issues/6199
            https://github.com/dotnet/dotnet-docker/issues/630
            https://github.com/dotnet/dotnet-docker/blob/master/samples/aspnetapp/aspnetcore-docker-https-development.md

        Chrome
            Composer
                There is a require timeout loading the modelrelief module.
        Edge
            Composer
                The fetch of the DepthBuffer file from wwwroot leads to a redirect back to the Login page.
                Is the anti-forgery token not recognized in the request?

        Firefox
            mr-service | [13:36:30 ERR] A Microsoft.AspNetCore.Server.Kestrel.Core.BadHttpRequestException exception happened in ModelRelief.

    Remove unused resources.
        docker image prune
        docker container prune

    Run a Docker container in the background.
        docker run -d -p 8080:5000 modelrelief
    Run a Docker container interactively.
        docker run -it -p 8080:5000 modelrelief

    Run a Docker container but override the default entrypoint with the command shell.
        docker run -it --entrypoint "cmd" -p 8080:5000 modelrelief
    Start a command shell in a running container.
        docker exec <container> cmd

    These commands can be used to start the SQLServer Express service as an <independent> container. ModelRelief running normally can access the container.
        docker run -d --name mrsql -p 1433:1433 -e sa_password=<> -e ACCEPT_EULA=Y microsoft/mssql-server-windows-express
        docker inspect mrsql

    Start the Docker services defined in docker-composer.yml in the current directory.
        docker-compose up

#### SQLServer
        In a new intallation, perform the following steps:
        SQLServer Management Studio
            Connect to the database instance using Windows Authentication.
                Enable SQL Server and Windows Authentication.
                Reset the SA password.

#### Publish and Deploy
    Production <must> set on the server:
        (?) ASPNETCORE_ENVIRONMENT      Production
        PATH                            C:\modelrelief\mrenv
        PYTHONPATH                      C:\modelrelief\Tools; C:\modelrelief\Solver;

        The secure (HTTPS, MRPortSecure) and insecure (HTTP, MRPort) ports must be configured.
            These are set in appSettings.ProductionIIS.json as MRPort and MRPortSecure.
            https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-2.1&tabs=visual-studio#require-https
            The secure port where the client is redirected (typically, 443 in production and 5001 in development).
            The insecure port (typically, 80 in production and 5000 in development).

    How are credentials handled in a ConnectionString in Production?
        https://stackoverflow.com/questions/44931613/how-to-correctly-store-connection-strings-in-environment-variables-for-retrieval

    Server Structure
        IIS Production
            modelrelief (ContentRootPath)
                <application files>
                logs
                mrenv
                store/production
                Solver
                Test
                Tools
                wwwroot

        Development, local Production
            ModelRelief (ContentRootPath)
                <application files>
                logs
                store/<Environment>
                Test
                wwwroot
            devenv
            Solver
            Tools

        'store' Notes
            The users folder is used to hold the user file system.
            When SQLite is configured, the database file is stored in store/<environment>/database.
            Also, the database folder is used to transfer the SQLServer seed database to the Docker database container during a build.

        SQLServer Notes
            The database is located here: C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA.
            Using SQL Server Management Studio:
                1) Delete the existing database.
                2) Copy the updated database from the User folder (e.g. C:\Users\Steve Knipmeyer) into C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA.
                3) Attach the updated ModelReliefProduction.db.

    Updating the mrenv requirements.production.txt
        conda list --export > <requirements.production.txt>

#### Jupyter
    Notebook confguration
        C:\Users\Steve Knipmeyer\.jupyter\jupyter_notebook_config.py
    conda install ipyparallel
    conda install -c conda-forge jupyter_contrib_nbextensions
    conda install -c conda-forge jupyter_nbextensions_configurator
    conda install -c conda-forge ipywidgets
    jupyter nbextension install --py widgetsnbextension --user
    jupyter nbextension enable --py --user widgetsnbextension

#### pybind11
    https://github.com/chhenning/pybind11_with_MSVC_2017


    python setup.py clean --all
    python setup --verbose build --debug install
    python setup.py --verbose build --debug
    python setup.py --verbose install

#### Performance
A Cmake Release build includes the 'O2' optimization flags. It is not necessary to define CXXFLAGS with additional switches.

np_fill, relief_fill
    The order of np_fill and releif_fill is critical. When np_fill follows relief_fill and the \<array target is the same\>, there is optimization which makes it much faster (8X).
    If the array targets are different, there is no performance difference.

#### Circular Dependencies
    https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem
    https://stackoverflow.com/questions/38841469/how-to-fix-this-es6-module-circular-dependency
    https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de

    Madge
        https://github.com/pahen/madge
        madge --warning --circular --extensions ts ModelRelief\Scripts

    ALM
        https://legacy.gitbook.com/book/alm-tools/alm/details

#### DbInitializer

|Setting|Description||
|---|---|---|
|MRUpdateSeedData|Update seed database and project files from Development user changes.|Camera, MeshTransform|
|MRInitializeDatabase|Deletes the database and recreates it.|
|MRSeedDatabase|Adds the test data to the database and populates the user store.||
|MRExitAfterInitialization|Perform initialization and then exits without starting the server.|

#### HTTPSRedirection
    HttpsRedirection
        It does not work on IIS Production and Development.
        It does work for IIS Express and Production.
        app.UseHttpsRedirection leads to Xunit test failure.
            Development disables HttpsRedirection to support XUnit.

#### HTTP/HTTPS
    IIS Production does not respond on HTTP 6000.
    Development cannot set a cookie on HTTP 5000.

#### Auth0
    IDaaS Benefits
        Overall security is vastly improved.
        Far fewer code will need to be written and maintained.
        Auth0 provides an excellend dashboard with analytics.
        API authorization will be supported.

    The Auth0 Authorization API Debugger does not work to issue 'password' grants.
        It does not contain these properties:
            audience
            client_secret

    Can authorization policies be used to provide access to sample models for all users?
        This would remove the need to seed the database with the test models <for each user>.

#### git Repository
        Separate
            NodeWorkbench
            Quokka Workbench
        Move ModelRelief\Test.
            Add Postman tests to source code control.
