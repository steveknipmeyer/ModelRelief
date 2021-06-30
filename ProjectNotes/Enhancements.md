# Enhancements
#### Related Models
    Model3d supports the addition of supporting models. Other resources?
        PostQueryParameters.AddRelatedModels
    Should Delete requests also remove related resources?
        Model3d
        Project
#### Optimization
    Profile the startup code.
        Optimize SettingsManager.Initialize[UserSession|Settings]Async
            Every property validation causes a database read.
#### OBJ Models
    Strengthen the OBJ validation.
        https://github.com/stefangordon/ObjParser
#### Python
    How can Python binary extensions be resolved (e.g. sys, time)?
#### Depemdency Manager
    Complete implementation of DependencyManager.GetAllDependencyTypes.
        This removes the necessity to construct a DependencyGraph in increasing order of dependencies.
        How can a DbContext be obtained? GetAllDependencyTypes will be used in the context of the integration tests.
#### UI
    Provide a histogram in the web UI representing the distribution of gradients.
#### WebGL2
    WebGL2 Support
        https://www.khronos.org/assets/uploads/developers/library/2017-webgl-webinar/Khronos-Webinar-WebGL-20-is-here_What-you-need-to-know_Apr17.pdf
    
        shaders
            GLSL 300 es
            https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
##### WebGL Debugging
        Investigate webgl-debug library.
    
        Explore Nsight for shader debugging.
    
        SpectorJS
            http://www.realtimerendering.com/blog/debugging-webgl-with-spectorjs/
    
        RenderDoc
            chrome --disable-gpu-watchdog --gpu-startup-dialog --allow-no-sandbox-job --allow-sandbox-debugging --no-sandbox --disable-gpu-sandbox
#### Database
    Update database DGML diagram.
#### TypeScript Image Class
    PNG Creation
        Integrate with Files utility class.
        File methods should share common setup steps for deleting existing files, etc.

    DepthBuffer, NormalMap should hold instances.
    Where should Image be placed in the source tree?
    methods
        Indexer
        RGB, RGBA values
        Vector3
#### Three.js
    Update OBJLoader.ts.
#### Explorer
    Build a Python installer package for Explorer.
    
    How can the mayavi log be viewed?
    
    3D Surface Visualization
        https://jakevdp.github.io/PythonDataScienceHandbook/04.12-three-dimensional-plotting.html
#### Solver
    Runtime error does not propagate back to UI.        
        Should Composer check IsFileSynchronized?
        Add a status widget to show processing progress obtained by GET of GeneratedFileModel metadata.
            Polling is done based on a timer.

        Generate result
            Result
            Processing time
            Polygons                   

    Silhouette
        Blend profile into mesh form.

    Should the Python image masks be integers or booleans (instead of doubles)?
    
    Gradients
        Why are portions of the generated mesh below the XY plane?
            Gradient Threshold introduces the below plane results!
    
        Evalute NumPy gradients and divergence.
            NumPy gradients are 1/2 the actual values at the edges. It is "blending".
            Review Difference handling of edges.
                lowresolution
                test
            Change switch to "Use Difference class"
    
    Poisson Solver
        How should the boundary conditions be handled?
        Are there alternate Poisson equation solvers available?
            https://hplgit.github.io/fenics-tutorial/pub/sphinx1/._ftut1003.html
            https://my.ece.utah.edu/~ece6340/LECTURES/Feb1/Nagel%202012%20-%20Solving%20the%20Generalized%20Poisson%20Equation%20using%20FDM.pdf
    
            Blender
                https://github.com/vilemduha/blendercam/blob/master/scripts/addons/basrelief.py
                What is the difference between ModelRelief and Blender depth buffers (linear vs. proportional)?
                Generate a test Blender depth buffer.
                How was the compositing processing defined to create the depth buffer?
#### Other Tools
    Explore
        Awesome Bump
        Knald
        xNormal
        ShaderMap
        Gimp Normal Plugin
#### Tests
    Develop test models to test the gaussian filter mask processing.
        The model should contain details near the edges (adjacent to the background) and near thresholded regions.
            Spheres (Positive, Negative)
            Cubes
            Architectural

    Improve rollback handling in integration tests.
        try/catch/finally?

    What NormalMap integration tests are appropriate?
#### Camera
    Add snapping to model vertices to set center of rotation. The center of rotation is the camera lookAt point.
#### Razor Views
    Some Views are identical. Should they use a shared ViewComponent?
        Create, Edit
        Details, Delete
#### FileOperationGenerate
    Validate the required properties are present.
        Implement a FluentValidation validator.
        Throw a validation exception if the required properties are not set.
#### Replace Console output with Logger operations.
    Add color support for logging.
#### FileTimeStamp
    Should this property be exposed?
    Should the assignment of FileSynchronized be deferred until the request has completed?
    FileStamp could potentially serve as the "complete" flag for a long-running request.
#### Queues
    FileRequest places a message in a work queue.
        FileIsSynchronized is reset to false.
        A status code of 202 is returned to the client who can poll the value of FileIsSynchronized.
            Consider returning an endpoint that can be used for querying the result of the task.
            meshes/id/file/task
    A worker process removes the request from the queue.
        An external job is dispatched which returns some kind of notification when complete.
        When the external job completes, the worker process sets FileIsSynchronized = true.
        Question: How does a worker process access the database?

    https://stackoverflow.com/questions/11779143/how-do-i-run-a-python-script-from-c
    https://medium.com/@dpursanov/running-python-script-from-c-and-working-with-the-results-843e68d230e5

    https://stackoverflow.com/questions/10788982/is-there-any-async-equivalent-of-process-start
    https://github.com/jamesmanning/RunProcessAsTask

    Long-running Requests:
    https://stackoverflow.com/questions/33009721/long-running-rest-api-with-queues

#### DepthBuffers:Model3d Dependency
    DepthBuffers should have an optional dependency on a Model3d.
    If the Model3d relationship is present, the dependency exists.
    Otherwise, the DepthBuffer exists independently, probably due to an explicit upload of a file created in another application.
    The DependencyManager invalidates DependentFiles only if a dependency changed. So, an existing DepthBuffer with (FileSynchronized = true) would not be impacted.
#### Database
    Use UUID not sequential integer keys in database. This will scale better.
    
    SQLite
        Multi-user Access
            Cookies are used so tests must be done from an external computer.
        64 bit support
#### Logging
    N.B. Solver stdout is sent to the console only if the Serilog MinimumLevel is Information. (MinimumLevel = Error will suppress it.)
    How can ModelRelief messages be associated with a category (e.g. 'Microsoft')?
    
    Limit the size of the log file.
    
    Log ApiErrorResult?
    
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
#### Shaders
    Gradients are calculated from the DepthBuffer which directly reflects the faceting of the model.
        Could the DepthBuffer use the fragment shader which has interpolated vertex coordinates?
#### Optimization
    Why is MeshValidator called several time during a Put request?
    
    Optimize BoundingBox procesing.
    
    Memory management!
        https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec

#### NET Core 5.1
    Newtonsoft.Json -> System.Text.Json
            https://stackoverflow.com/questions/57700678/how-do-you-read-a-simple-value-out-of-some-json-using-system-text-json#57700761
            https://josef.codes/custom-dictionary-string-object-jsonconverter-for-system-text-json/
            https://dotnetcoretutorials.com/2019/12/19/using-newtonsoft-json-in-net-core-3-projects/

#### StorageManager
An ApplicationUser could have a storage folder property that is used by the StorageManager to define the default location.
#### Query Relationships
    Provide "reference expansion" to allow references to be expanded into the principal object.
        Extended 'related' query parameter.
#### Viewer
    Large Models
        Design: Should all models be scaled to fit within the default view frustrum?
            Are Meshes unitless? How will a (pixel-based) mesh be scaled to real world units?
        If a model is too large (on the order of the default far clipping plane), the views are malformed.
            Fit View may not work because it calculates only the clip planes.
                <It also needs to calculate the camera position.>
            The UI CameraControls need to be set based on the dimensions of the model.
    
    Transform Control
        This would allow the model to be positioned instead of the camera to set up the scene with much more control.
    
    Progress Indicator
    OrbitControls versus Trackball
    Add MaterialLoader.
    
    Create a set of sample materials such as wood, glass, plaster, etc.
#### Update Model3d
    Should there be a mechanism to update an <existing> Model3d file?
        Model3d.Edit View
#### Session    
    Wrap HttpContext.Session?
