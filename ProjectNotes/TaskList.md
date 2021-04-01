#### Commit       

### General           

    Default Camera is Back not Front.
        Set a default value to Position.
    
    The Compose link in the Projects View has the wrong Id for a newly-updated model.
        When the database is built from SeedContent.json, the Model and Mesh Ids are the same.
        N.B. A Model3d may have multiple Meshes.

    If an uploaded Model3d fails the file validation, an orphan Model3d remains in the database.
        Should a database transaction be used to remove all related models?       

    Should there be a mechanism to update an <existing> Model3d file?
        Model3d.Edit View
        
    Licenses
        Verify all models are attributed.

    SMK
        https://www.turbosquid.com/Search/3D-Models/free?exclude_branded=1&exclude_editoriallicense=1&include_artist=SMK-National-Gallery-of-Denmark
        https://www.smk.dk/en/article/digitale-casts/

    A new user does not receive the Default settings

    Initialization
        Where should database initialization be done?
        Where should (global) StorageManager be assigned?
        How can a DomainModel have access to DI services?
        DI
            Initializer (?)
            DbInitializer
            DbFactory: I DbFactory
            ModelReferenceValidator: IModelReferenceValidator
            Query: IQuery
            SettingsManager: ISettingsManager
            StorageManager: IStorageManager

        DbInitializer
            Set control flags in initialization rather than reading the configuration in methods.
            Can DbFactory be a DI parameter?

        DatabaseCollectionFixture
            Can DatabaseCollectionFixture be a DI constructor parameter?
            https://stackoverflow.com/questions/39131219/is-it-possible-to-use-dependency-injection-with-xunit

        Initializer
            Can SettingsManager be a DI constructor parameter?


    Add a busy indicator.
        https://stackoverflow.com/questions/60427408/asp-net-core-busy-indicator-while-downloading-file
        http://johnatten.com/2013/12/22/asp-net-mvc-show-busy-indicator-on-form-submit-using-jquery-and-ajax/

    Review the semantics of Mesh and Model editing (Compose).
        ComposerController uses a Mesh endpoint.

    Thumbnails
        Add support for creating mesh "thumbnails" from the mesh canvas.
            Add a new endpoint mesh/preview for a preview image of the mesh. 
                mesh/{id}/thumbnail
            Create using the Canvas image of the last generated Mesh.  

        Project Index
            Use Index page as a template for the Project page.
                Each user model is hosted in a tile.

    Create
        Why is the FormFile binding lost?
            The focus has to leave the input field.

        Style the Create page.
    
        How will the Mesh/Model Camera be handled for a new model (before a Mesh has been generated)?
            getBoundingClippingPlanes: nearPlane = -5.132047176361084 (BaseCamera.ts:131)
            FileIsSynchronized?

    Projects
        Project DropDowwn Control
            Should the Menu label link to the active project?
                This requires using the dropdown arrow to activate the menu.

        Create Project
            How should a new project be created?
                Projects/Create is the baseline.
    
    Convert Mesh to OBJ default to support download of generated Mesh.

    Profile the startup code.

    Final Height MeshTransform Setting
        Review the description of the control.
            This setting controls the height of the final relief. It is a percentage of the depth of the original model.

    Verify Resolution.Image setting.

    Test new user creation.
        52oCTRbyDVifvQTiSdyn0mkrXwhMiTEe

    Optimize SettingsManager.Initialize[UserSession|Settings]Async
        Every property validation causes a database read.

    Support query by wildcard and exact mode.

    Reduce model sizes in MeshLab!
        remote: warning: File ModelRelief/Test/Data/User/models/roadster/roadster.obj is 62.69 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
        remote: warning: File ModelRelief/Test/Data/User/models/statue/statue.obj is 53.92 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB

    Settings
        Paths:ResourceFolders:Camera
        Paths:ResourceFolders:MeshTransform

    Why is it (intermittently) necessary to run ModelRelief before testrunner?
        testrunner does initialize the database....
        Restore logic?

    Investigate Chrome page warnings.
        Compose has multiple progressBar ids.
        
    Session    
        Wrap Http.Context?

    [ApiCcontroller]
    ModelState
        Does ValidationActionFilter.OnActionExecuting need to do more processing for ModelState?

    GetFile: Is "application/json" required or could "application/octet-stream" be better?
            // WIP: When:
            //  1) The FileContentResult encoding is set to "application/octet-stream".
            //  2) The RestController GetFile action method has [Produces("application/octet-stream")].
            //  3) The client request header specifies "Accept : 'application/octet-stream'".
            //  The server returns HTTP status 406 "Not Acceptable" as though the requested format could not be matched to the client request.
            //  Is a CustomFormatter required?
            var response = new FileContentResult(contents, "application/octet-stream");
#### Models
    OBJ viewer has missing polygons.
        Plunderbuss
        House

    Review all mesh generation settings for delivered models.
    Attenuation Decay.
        It is 0.9 in the thesis but there are values of 0.6 in the sample data set.
#### Solver
    Runtime error does not propagate back to UI.
        The runtime failure happens during the DependencyManager processing (FileGenerate) so it is not synchronous with the Put request.
            The Solver could mark the output mesh as invalid and encode the status result in a metadata file written to the file folder.
                Should the GeneratedFile be deleted if the Solver fails?
            A subsequent Get can read the metadata file and report the results (successful or unsuccessful).
        Generate result
            Result
            Processing time
            Polygons
    Can the CancellationToken be used to handle aborted processing?    

    Silhouette
        Blend profile into mesh form.
#### Issues
    How does lucy.sfp get corrupted?
        -rw-r--r--  1 stephen stephen 1048576 Feb  4 14:22 lucy.sfp (1 additional byte)
        -rw-r--r--  1 stephen stephen 1048577 Feb  5 15:19 lucy.sfp
#### UI
    Create a video or an animation?
    Workflow page
        Illustrate with images from Explorer!
#### Build
    Review target=nginx handling in Builder.py.
        python Build/builder.py --target nginx --deploy True
        Elevated permissions are required in Builder to deploy to delete /var/www.
        Can the Nginx configuration be accomplished only through /etc/nginx/sites-available/default?

    Prove with clean Ubuntu installation!
        Add a test account.

    Convert Alpha to a Linux server.
### Security
    Remove steve@knipmeyer.org.
    Azure Key Secrets
        Review settings in AzureKeyVault.
        Mock azurekeysecrets.json.
            Move to a new settings file?
            How should the contact e-mail address be defined?
    Auth0 contains references to www. modelrelief.com.
        http://www.modelrelief.com/images/ModelReliefBlue.png
    Disable execute permissions on the file upload location.
### Refactoring
    Review all casing of files and directories.
    Tools -> bin

### Project
    Structure GitHub repo using recommended best practices.
    Add OneNote ModelRelief notebook.
    Documentation
        Document DepthBufferView and analyze tools (e.g. HtmlLogger).
        Document VcXsrv
        AzureKeyVault
        Solver
        Explorer
        pyamg warning
            pyamg/gallery/stencil.py:110: FutureWarning: Using a non-tuple sequence for multidimensional indexing is deprecated; use `arr[tuple(seq)]` instead of `arr[seq]`. In the future this will be interpreted as an array index, `arr[np.array(seq)]`, which will result either in an error or a different result.
            diags[s] = 0
        (Hidden) DepthBufferView and NormalMapView
        Desmos attenuation graph
        Document Solver defaults as active settings (no Web UI).
        SystemSettings.json
            logging
            developmentgui
        Features not published
            clipping planes
            perspective cameras
        API
        ModelRelief.dgml (Linux?)
### Publishing
    Host on Digital Ocean.
    KAK invitation
    Notices:
        3D CAD Jewelry
            https://matrixusergroup.com/
        CNC
        ArtCAM
        Vectrix
        3D Printing
        HackerNews
### SSL
    https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04
    https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/

### License
    Replace copyright headers with MIT license notice.
