# Issues
#### Browser Warnings
    Investigate Chrome page warnings.
        Compose has multiple progressBar ids.
#### Explorer
    Explorer throws segmentation fault.
        Execution from command line.
        A new tab has been selected.
#### Mayavi
    Intermittently, the Mayavi Pipeline dialog box opens as a blank window.
        The test program Solver/Experiments/mayavi/mayavitest.py has the same issue.
   
    Meshes are not oriented correctly in Mayavi Isometric views.
#### NormalMaps
    It appears that NormalMap gradients lose some high frequency detail.
#### Solver
    A default relief size of 1024 leads to a Chrome exception.

    Orthogonal planes (e.g. House) do not generate constant Z depths.
    
    Zoomed Orthogonal views of House yield malformed meshes.
#### Relief Size   
    MeshTransform
        Height : Should this be a calculated property?
            Height = Width * (DepthBuffer aspect ratio)?
        Depth : What is the relationship of this property to ReliefScale?
#### Composer   
    Clipping planes are not preserved when a Composer view is initialized.
#### StandardView
    The StandardView does not show the currently selected view.
    When the view camera is interactively changed, it should invalidate the StandardView in the UI.
##### Camera
    Perspective <-> Orthographic
        The new view does not match the previous view.
        Fit View is used after the conversion.

    Why does the Mesh view shift slightly after a new Mesh has been generated?  
        The camera is not changed.
        this.meshViewer.setCameraToStandardView(StandardView.Top) is used to ensure the resulting view is visible.

##### Clipping Planes
    Investigate why the clipping plane CameraControls are not editable.
        Could the events be intercepted by the TrackBall?
        Is this a dat.gui issue?
    Should the near clipping plane always be adjusted to the front extent?
#### .NET Core
    Replace DateTime with a type that has more resolution.
#### API
    A Put (File) request returns Created instead of OK. The file is correctly replaced but the status should be OK.
#### Model Loaders
    The OBJLoader does not handle Bones.
#### VSCode Issues
    How can the C# style checker be manually run in VSCode?
        https://github.com/OmniSharp/omnisharp-vscode/issues/43
    
    Why does the VSCode Python debugger not find modules in other folders?
        This happens only in the debugger.
        Adding .env to the workspace root resolves the issue.
            PYTHONPATH=.
                The causes the entire OS env PYTHONPATH to be added to the search path.
#### Exception handling
    The ApiValidationResult exposes too much about internals in the developer message (RequestType).
    
    How should database exceptions, such as those violating Domain DataAnnotation rules, be handled?
    Cancellation
        https://andrewlock.net/using-cancellationtokens-in-asp-net-core-mvc-controllers/
    
    SqliteException: SQLite Error 5: 'database is locked'.
        PostFileRequestHandler : DbContext.SaveChanges();
    
    Throwing policy.
        https://stackoverflow.com/questions/2999298/difference-between-throw-and-throw-new-exception
#### Python
    Why does venv not add the Python 3.8 include files?
    Why does the 1st mayavi install fail with a vtk module error?
#### Dependency Injection
    Can DI inject a Logger instance (suitably typed) instead of using ILoggerFactory to manufacture the instance?

    Can Autofac be replaced with .NET Core DI?
        https://github.com/jbogard/MediatR/wiki

        Do services have to be cached?
            // service provider for contexts without DI
            ServicesRepository.StorageManager = storageManager;

        .NET 5.0 Required for MediatR Constrained Open Generics
            https://jimmybogard.com/constrained-open-generics-support-merged-in-net-core-di-container/

        DI Setup Libraries
            https://andrewlock.net/using-scrutor-to-automatically-register-your-services-with-the-asp-net-core-di-container/
            https://www.thereformedprogrammer.net/asp-net-core-fast-and-automatic-dependency-injection-setup/       
#### Integration Testing
    Why does the AutoRollback xUnit attribute not perform a database rollback?              

    Why is it (intermittently) necessary to run ModelRelief before testrunner?
        testrunner does initialize the database....
        Restore logic?
#### Documentation
     Create the documentation content for the endpoints.
        api/v1/documentation/{controller}/{error}
#### OBJ Viewer
    Some models have missing polygons.
        Plunderbuss
        House
