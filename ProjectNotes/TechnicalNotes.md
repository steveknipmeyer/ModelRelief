# Technical Notes

<div style="font-size:9pt">

### Front End (TypeScript)

#### Interfaces

The FE DTO interfaces are used to facilitate construction of DTO models from HTTP.

|Graphics||DTO (HTTP)|
|--|---|---|
|||IModel||
|||IFileModel||
|||IGeneratedFileModel||
|||||
|||ICamera||
|||IDepthBuffer||
|||IMesh||
|||IMeshTransform||
|||IModel3d||
|||INormalMap||
|||IProject||
|||ISettings||

```javascript
export interface IModel
export interface IFileModel extends IModel
export interface IGeneratedFileModel extends IFileModel

export interface ICamera extends IModel
export interface IDepthBuffer extends IGeneratedFileModel
export interface IMesh extends extends IGeneratedFileModel
export interface IMeshTransform extends IModel
export interface IModel3d extends IFileModel
export interface INormalMap extends IGeneratedFileModel
export interface IProject extends IModel
export interface ISettings extends IModel
```

#### Base Classes
DTO models are in an inheritance chain so they can share common functionality such as API HTTP requests.

|Graphics||DTO (HTTP)|
|--|---|---|
|Model||DtoModel|
|FileModel||DtoFileModel|
|GeneratedFileModel||DtoGeneratedFileModel|

**Graphics**
```javascript
export class Model implements IModel
export class FileModel extends Model implements IFileModel
export class GeneratedFileModel extends FileModel implements IGeneratedFileModel
```
**DTO**
```javascript
export class Model<T extends IModel> implements IModel
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel
```

#### Concrete Classes

|Graphics |Implementation||DTO (HTTP) |Implementation||THREE|
|---|---|---|---|---|---|---|
|Camera|IModel<br>Model||DtoCamera|IModel, ICamera<br>DtoModel||THREE.Camera|
|DepthBuffer|IGeneratedFileModel<br>GeneratedFileModel||DtoDepthBuffer|IGeneratedFileModel, IDepthBuffer<br>DtoGeneratedFileModel||
|Mesh|IGeneratedFileModel<br>GeneratedFileModel||DtoMesh|IGeneratedFileModel, IMesh<br>DtoGeneratedFileModel||THREE.Mesh|
|MeshTransform|IModel<br>Model||DtoMeshTransform|IModel, IMeshTransform<br>DtoModel|||
|Model3d|IFileModel<br>FileModel||DtoModel3d|IFileModel, IModel3d<br>DtoFileModel||THREE.Mesh|
|NormalMap|IGeneratedFileModel<br>GeneratedFileModel||DtoNormalMap|IGeneratedFileModel, INormalMap<br>DtoGeneratedFileModel||
|Project|IModel<br>Model||DtoProject|IModel, IProject<br>DtoModel||
|Settings|IModel<br>Model||DtoSettings|IModel, IProject<br>DtoModel||


**Graphics**
```javascript
export class Camera extends Model
export class DepthBuffer extends GeneratedFileModel
export class Mesh extends GeneratedFileModel
export class MeshTransform extends Model
export class Model3d extends FileModel
export class NormalMap extends GeneratedFileModel
export class Project extends Model
```
**DTO**
```javascript
export class Camera extends Model<Camera> implements ICamera
export class DepthBuffer extends GeneratedFileModel<DepthBuffer> implements IDepthBuffer
export class Mesh extends GeneratedFileModel<Mesh> implements IMesh
export class MeshTransform extends Model<MeshTransform> implements IMeshTransform
export class Model3d extends FileModel<Model3d> implements IModel3d
export class NormalMap extends GeneratedFileModel<NormalMap> implements INormalMap
export class Project extends Model<Project> implements IProject
```

___
## Back End (NET Core)

### Interfaces
---
|DTO (HTTP)||Domain (DB)|
|---|---|---|
|Dto.IModel|||
|Dto.IFileModel|
|Dto.IGeneratedFileModel|

**DTO**  
ModelRelief/Features/Dto
```csharp
public interface IModel
public interface IFileModel : IModel
public interface IGeneratedFileModel : IFileModel
```

### Base Classes
---
Domain models are in an inheritance chain so they can share common functionality such as file operations.  
<span style="color:red">
Implementing a hierarchy of DTO models creates potential issues with DataAnnotation attributes sucn as Display(Name).
</span>

|DTO (HTTP)||Abstract Domain (DB)|
|--|--|--|
|||Domain.DomainModel|
|||Domain.FileDomainModel|
|||Domain.GeneratedFileDomainModel|


**Domain**  
ModelRelief/Domain/Abstract
```csharp
public abstract class DomainModel
public abstract class FileDomainModel : DomainModel
public abstract class GeneratedFileDomainModel : FileDomainModel
```
### Concrete Classes
---
|DTO (HTTP)<br>ModelRelief/Features|Implements|Notes||Domain Models (DB)<br>ModelRelief/Domain |Inherits|
|---|---|---|---|---|---|
|Dto.Camera|Dto.IModel|||Domain.Camera|DomainModel|
|Dto.DepthBuffer|Dto.IGeneratedFileModel|||Domain.DepthBuffer|GeneratedFileDomainModel|
|Dto.Mesh|Dto.IGeneratedFileModel|||Domain.Mesh|GeneratedFileDomainModel|
|Dto.MeshTransform|Dto.IModel|||Domain.MeshTransform|DomainModel|
|Dto.Model3d|Dto.IFileModel|||Domain.Model3d|FileDomainModel|
|Dto.NormalMap|Dto.IGeneratedFileModel|||Domain.NormalMap|GeneratedFileDomainModel|
|Dto.Project|Dto.IModel|||Domain.Project|DomainModel|
|Dto.Settings|Dto.IModel|||Domain.Settings|DomainModel|
|||||

**DTO**  
ModelRelief/Features
```csharp
public class Camera : IModel
public class DepthBuffer : IGeneratedFileModel
public class Mesh : IGeneratedFileModel
public class MeshTransform : IModel
public class Model3d : IFileModel
public class NormalMap : IGeneratedFileModel
public class Project : IModel
```
**Domain**  
 ModelRelief/Domain/Concrete
```csharp
public class Camera : DomainModel
public class DepthBuffer  : GeneratedFileDomainModel
public class Mesh : GeneratedFileDomainModel
public class MeshTransform : DomainModel
public class Model3d : FileDomainModel
public class NormalMap  : GeneratedFileDomainModel
public class Project : DomainModel
```
___
</div>

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


---
#### Dependency Manager
    Dependency Table
        Dependent Id    Dependent Type      Dependency Id   Dependency Type
        1               Mesh                3               DepthBuffer
        1               Mesh                5               MeshTransform
        3               DepthBuffer         11              Model
        3               DepthBuffer         7               Camera

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

#### Models
        Dragon
        Horse
        House
        Lucy
        Plunderbuss Pete
        Scallop
    
        Not Used
            Armadillo
            Buddha
            Bunny
            Dolphin
            LowResolution
            Roadster
            Statue
            Test
            Tyrannosaurus
    
        Thingiverse Sculpture
        Archive 3D
            Pegasys
            David
            https://archive3d.net/?category=31

#### WebGL
    https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
    
    Chrome "paused before potential out-of-memory crash".
        https://stackoverflow.com/questions/42110726/chrome-devtools-paused-before-potential-out-of-memory-crash
        https://developers.google.com/web/tools/chrome-devtools/memory-problems/

##### FE Model Structure
    DTO objects are used for DATA TRANSFER to the server, either through web page endpoints or the API.
        So, a web page is not bound to use a DTO *object* if the page does not use POST/PUT, etc.

###### Property Change Handlers
https://msdn.microsoft.com/magazine/mt694083
https://msdn.microsoft.com/en-us/magazine/mt767693.aspx

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

The Project is populating the object graph too deeply.

A Put (File) request returns Created instead of OK. The file is correctly replaced but the status should be OK.

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
    Algorithms
    Dr. Jens Kerner                         https://people.mpi-inf.mpg.de/~kerber/publications/Jens_Kerber_Masterthesis.pdf
    Gaussian Box Blur           MIT         https://www.peterkovesi.com/matlabfns/citesite.html
    Ivan Kutskir                MIT         http://blog.ivank.net/fastest-gaussian-blur.html
    
    Front End
    THREE.js                    MIT         https://threejs.org
    TypeScript                  Apache      https://www.typescriptlang.org/
    Bootstrap                   MIT         https://getbootstrap.com/
    base64-js                   MIT         https://github.com/beatgammit/base64-js/blob/master/index.js
    http-status-codes           MIT         https://www.npmjs.com/package/http-status-codes
    
    Back End
    ASP.NET Core                Apache      https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1
    NumPy                                   https://www.numpy.org/
    PyAMG                       MIT         https://github.com/pyamg/pyamg
    Mavavi                      MIT, GPL    https://docs.enthought.com/mayavi/mayavi/
    Autofac                     MIT         https://github.com/autofac/Autofac
    C#                        	MIT         https://en.wikipedia.org/wiki/C_Sharp_(programming_language)
    Python                      PSF         https://www.python.org/
    Auth0                       Microsoft   https://auth0.com/
    Microsoft Azure             Microsoft   https://azure.microsoft.com/en-us/services/key-vault/
    MediatR                     Apache      https://github.com/jbogard/MediatR/blob/master/LICENSE
    FeatureFolders              MIT         https://raw.githubusercontent.com/OdeToCode/AddFeatureFolders/master/LICENSE
    OpinionatedApiController    MIT         https://github.com/schneidenbach/RecessOpinionatedApiInAspNetCore
    ContosoCore                 MIT         https://github.com/jbogard/ContosoUniversityDotNetCore
    Serilog                     Apache      https://www.apache.org/licenses/LICENSE-2.0
    AutoMapper                  MIT         https://github.com/AutoMapper/AutoMapper
    CommandLineParser           MIT         https://github.com/commandlineparser/commandline
    MailKit                     MIT, GPL    https://github.com/jstedfast/MailKit
    Fluent Validation           Apache 2.0  https://github.com/JeremySkinner/FluentValidation
    Swashbuckle                 MIT         https://github.com/domaindrivendev/Swashbuckle.AspNetCore
    
    3D Models
    Model                                       Source      License             Link
    Armadillo                                   Stanford
    Buddha                                      Stanford
    Bunny                                       Stanford
    Dolphin                                     TurboSquid  RoyaltyFree         https://www.turbosquid.com/FullPreview/Index.cfm/ID/332975
    Dragon                                      Stanford
    Horse                                       TurboSquid  RoyaltyFree         https://www.turbosquid.com/3d-models/statue-3d-model/587173
    House (San Francisco)                       TurboSquid  RoyaltyFree         https://www.turbosquid.com/FullPreview/Index.cfm/ID/832520
    Lucy                                        Stanford
    Plunderbus Pete                             Thingiverse Creative Commons    https://www.thingiverse.com/thing:144775
    Roadster (Duesen Bayern Mystar 190 SL)      TurboSquid  Editorial(None)     https://www.turbosquid.com/3d-models/free-duesen-bayern-mystar-190-3d-model/1062796
    Scallop                                     ModelRelief
    Statue                                      Stanford
    Test                                        ModelRelief
    Tyrannosaurus                               Stanford
    
    Art
    Scallop Image                               Dreamstime  Royalty Free        https://www.dreamstime.com/scallop-logo-isolated-scallop-white-background-scallop-logo-isolated-scallop-white-background-eps-vector-illustration-image131838280
    Scallop Icon                                Flaticon    Royalty Free        <div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

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
        IValidatableObject
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

#### ASPNET Core Environment Variables
The XUnit tests cannot be run with any required prompts for user verification because *the console is not displayed*.
ServerFramework (WebHost.CreateDefaultBuilder) sets the environment to "Development" *however the environment variables from launchSettings.json are not used.*

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

#### C#
    Conversion of List of derived class to the base class.
        // https://stackoverflow.com/questions/1817300/convert-listderivedclass-to-listbaseclass
        dependentModels = new List<DomainModel>(candidateDependentModels).ConvertAll(m => (DomainModel)m);
    
    Using reflection to call a generic method:
        // https://stackoverflow.com/questions/4101784/calling-a-generic-method-with-a-dynamic-type
        // https://stackoverflow.com/questions/16153047/net-invoke-async-method-and-await
        var method = typeof(ValidatedHandler<TRequest, TResponse>).GetMethod(nameof(ModelExistsAsync)).MakeGenericMethod(referenceType);
        var modelExists = await (Task<bool>)method.Invoke(this, new object[] {claimsPrincipal, (int) propertyValue});

###### Stormpath Pattern
    Rich error message:
        Status Code         HttpStatusCode
        Code                ApiErrorCode
        Message             Errors[]
        DeveloperMessage    DeveloperMessage
        API Reference       ApiReference

#### Mediator
    Mediator Pipeline
        Should there be top-level logging and exception handling in a pipeline wrapper?
        https://codeopinion.com/fat-controller-cqrs-diet-command-pipeline/
#### Autofac
    ASP.NET Core
    https://autofac.readthedocs.io/en/latest/integration/aspnetcore.html
    
    Example
    https://github.com/autofac/Examples/tree/master/src/AspNetCoreExample

#### Fluent Validation
    https://github.com/JeremySkinner/FluentValidation

#### VSCode Debugging Workflows
    Command Line
        FE: Chrome   BE: VSCode  TypeScript: automatic  Reload: automatic
            dotnet run
            gulp serve (automatic TypeScript/reload)
            VSCode Profile: .NET Core Attach
    
    VSCode Profile: .Net Core With FE Debugging in VSCode
        FE: VSCode   BE: VSCode  TypeScript: DNW  Reload: DNW
    
    VSCode Profile: .Net Core Launch
        FE: Chrome   BE: VSCode  TypeScript: DNW  Reload: DNW

#### Depth Buffer Notes
    The depth buffer raw values are linear. Can the precision be higher?
        https://stackoverflow.com/questions/42509883/how-to-correctly-linearize-depth-in-opengl-es-in-ios/42515399#42515399
    
    Experiment with precision setting in THREE.WebGLRenderer.
    
    Precision is substantially improved by moving the Near plane as close to the model as possible.
        Pulling in the Far plane does not seem to improve the precision.
    
    The range of the depth buffer is based on the distance between the Near and Far planes.
        If the Near and Far planes bound the model, the range will be [0.1].

#### TypeScript
    How can a subclass call the property (method) of a super class?
        https://github.com/Microsoft/TypeScript/issues/4465
        ModelViewer extends Viewer
            set model (model : THREE.Object) {
                super.model(model);     // not valid
            }
    
        var uint8Array = new Uint8Array((<any>fileDataObj.target).result);
            EventTarget does not contain a member result.
            https://github.com/Microsoft/TSJS-lib-generator/pull/207
            https://github.com/Microsoft/TypeScript/issues/299

#### Identity
    https://andrewlock.net/introduction-to-authentication-with-asp-net-core/

#### ASP.NET Core Model Validation
    https://github.com/JeremySkinner/FluentValidation/wiki/i.-ASP.NET-Core-integration

#### Tasks
        // prevent async (no await) warning
        //https://stackoverflow.com/questions/44096253/await-task-completedtask-for-what
```c#
        await Task.CompletedTask;
```
#### Numpy

**Benchmarks (512x512 Array)**
|Operation|Numpy Time|Python Time |Ratio|Note|
|-|-|-|-|-|
|Gradient|0.00550|47.7558|10,000|
|Scale Floats|0.02|4.5|2,250|
|Finite Difference|.002|0.2315|100|Attenuation|

#### Mayavi
        pip install mayavi
        pip install --upgrade --force-reinstall mayavi

#### NPM Package Manager
https://semver.npmjs.com/

    Why does node_modules use three 0.86 when package.json specifies ^0.86 which should admit 0.89 as the latest version.
    It seems that a leading zero for the major version is ignored and only the 2nd and 3rd fields are processed.
    
    npm install -g npm-install-missing
    npm install --global --production npm-windows-upgrade

#### Publish and Deploy   
        The insecure and secure  ports must be configured.
            (insecure) HTTP: The insecure port (typically, 80 in production and 5000 in development).
            (secure)  HTTPS: The secure port where the client is redirected (typically, 443 in production and 5001 in development).
    
        export ASPNETCORE_URLS="https://localhost:5001/;http://localhost:5000/"
    
    azurekeyvault.json must be copied to the root folder.
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

#### Entity Framework Core
##### Tracking
    https://stackoverflow.com/questions/27423059/how-do-i-clear-tracked-entities-in-entity-framework
    context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

##### Client Server Queries
    https://docs.microsoft.com/en-us/ef/core/querying/client-eval

#### CSS
Chrome DevTools snippet to report on unused CSS: https://gist.github.com/kdzwinel/426a0f76f113643fa285

### Nginx
    Administration
        Create a new sudo account ('admin') from which to manage nginx.
            sudo adduser nginxadmin
            sudo usermod -a -G sudo nginxadmin
    
    Debugging
        https://michaelscodingspot.com/debugging-asp-net-web-request-errors/
        Add additional logging output.
    
    What is the correct way to stop and restart Nginx?
        sudo /etc/init.d/nginx start | stop | restart

#### Browser-Sync
https://west-wind.com/wconnect/weblog/ShowEntry.blog?id=943

#### Material Frameworks
    Materialize : http://materializecss.com
    Material Design Lite : https://getmdl.io
    MUI : https://www.muicss.com
    Material Foundation : https://eucalyptuss.github.io/materia...
    Material : http://daemonite.github.io/material
    Lumx : http://ui.lumapps.com

#### Favicon
        https://realfavicongenerator.net/
        https://www.flaticon.com/free-icon/scallop_166047
        https://realfavicongenerator.net/favicon/aspnet_core#.W_6RlGhKjmE

#### Swagger
    API authentication must include  the type "Bearer":   
        Bearer <JWT>
#### Pyamg
    https://github.com/pyamg/pyamg/commit/a188d5b8c03337018d8fe4f8bb883a8decc95bb5
    This warning has been resolved in the tip of Pyamg but a new version (4.0.0+) has not been distributed.
    devenv/lib/site-packages/pyamg/gallery/stencil.py:114: FutureWarning: Using a non-tuple sequence for multidimensional indexing is deprecated; use `arr[tuple(seq)]` instead of `arr[seq]`. In the future this will be interpreted as an array index, `arr[np.array(seq)]`, which will result either in an error or a different result.
        diag[s] = 0

#### Auth0
    My Auth0 login uses my Microsoft (steve@knipmeyer.org) credentials.
    
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

    Consent Dialog 
        localhost introduces issues. Modify /etc/hosts as described below to suppress the "Access to Tenant" dialog box.
            https://auth0.com/docs/authorization/user-consent-and-third-party-applications#skipping-consent-for-first-party-clients

#### HTTPSRedirection
    app.UseHttpsRedirection leads to Xunit test failure.
        Development hosting environment disables HttpsRedirection to support XUnit.

#### FileDomainModel
    Casting from DomainModel to FileDomainModel can only be done when access to the specific type is not needed.
    PostFile
        var fileName = Path.Combine(storageManager.DefaultModelStorageFolder(domainModel), domainModel.Name);
        The resolution of a storage location depends on looking up the TEntity.Name as a resource.

#### AutoMapper
    The AutoMapper.QueryableExtensions ProjectTo will populate an object graph when used with a query.
    Otherwise, navigation properties will be null.
        var result = await DbContext.Set<TEntity>()
                .ProjectTo<TGetModel>(Mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(m => m.Id == message.Id);
    
    Getting along with AutoMapper and Autofac
    https://kevsoft.net/2015/09/14/getting-along-with-automapper-and-autofac.html

#### Image processing

    ImageSharp
        A 16 bit grayscale image is created from normalize values[0..1] however:
            The pixel values do not span the entire dynamic range [0..65535].
            The background has value [54, 54, 54].
    
    Images in ASPNET
        https://github.com/SixLabors/ImageSharp
        https://blogs.msdn.microsoft.com/dotnet/2017/01/19/net-core-image-processing/
        https://andrewlock.net/using-imagesharp-to-resize-images-in-asp-net-core-a-comparison-with-corecompat-system-drawing/

#### File Transfers
        JavaScript
            These solutions are for saving files on the client (not server) side.
                https://github.com/eligrey/FileSaver.js/
                https://github.com/jimmywarting/StreamSaver.js

#### Testing
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
    
    Investigate chai for FE JavaScript testing.

#### Performance
A Cmake Release build includes the 'O2' optimization flags. It is not necessary to define CXXFLAGS with additional switches.

np_fill, relief_fill
    The order of np_fill and releif_fill is critical. When np_fill follows relief_fill and the /<array target is the same/>, there is optimization which makes it much faster (8X).
    If the array targets are different, there is no performance difference.

#### Circular Dependencies
    https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem
    https://stackoverflow.com/questions/38841469/how-to-fix-this-es6-module-circular-dependency
    https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
    
    Madge
        https://github.com/pahen/madge
        madge --warning --circular --extensions ts ModelRelief/Scripts

#### FileGenerateRequest
    A GenerateFileRequest is queued when:
        FileIsSynchronized : False -> True
        No FileTimeStamp change (avoiding a POST false positive)
    
    DepthBuffer does not implement FileGenerateRequest now because there is no means to generate a new DepthBuffer on the backend.
        Later, there could be a case for generating DepthBuffers on the server to allow completely API-driven workflows.
    
    N.B. GeneratedFile models held in memory (e.g. DepthBuffer in ComposerController) do not have the FileIsSynchronized property updated (invalidated) after a dependency (e.g. Camera) has been modified.
        Therefore, the ComposerView instances of DepthBuffer, Mesh do not accurately reflect the state of FileIsSynchronized in the database.
        So, ComposerController explicitly sets FileIsSynchronized before a GeneratedFileModel update (PUT) to express the intent.
#### DbInitializer

|Setting|Description||
|---|---|---|
|MRUpdateSeedData|Update seed database and project files from Development user changes.|Camera, MeshTransform|
|MRInitializeDatabase|Deletes the database and recreates it.|
|MRSeedDatabase|Adds the test data to the database and populates the user store.||
|MRExitAfterInitialization|Perform initialization and then exits without starting the server.|

#### HTML
    What is the correct use of user-scalable-no? Should it appear only on the Model Viewer page and not be included in the _Layout.cshtml?
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    
    What is the asp-fallback-test for jquery-validation-unobtrusive?
    
    Why does jQuery need to be loaded before require.js (module mismatch error)?
        https://stackoverflow.com/questions/4535926/how-do-i-use-requirejs-and-jquery-together

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

#### HTML ContentResult
```csharp
/// <summary>
/// Action method for settings.
/// </summary>
public ContentResult Index()
{
    return new ContentResult
    {
        ContentType = "text/html",
        StatusCode = (int)HttpStatusCode.OK,
        Content = $"Environment = {HostingEnvironment.EnvironmentName}<br>" +
        $"ASPNETCORE_URLS = {ConfigurationProvider.GetSetting(ConfigurationSettings.URLS)}<br>",
    };
}
'''

#### Relation
        Potential collection navigation properties:
            Project -> Cameras
            Project -> DepthBuffers
            Project -> Meshs
            Project -> MeshTransforms
            Project -> Model3ds
            Project -> NormalMaps
            Model3d -> DepthBuffers
            Model3d -> NormalMaps
            Camera -> DepthBuffers
            Camera -> Meshes
            Camera -> Model3ds
            Camera -> NormalMaps
            DepthBuffer -> Meshes
            NormalMap -> Meshes
            MeshTransform -> Meshes
            Setttings -> Projects