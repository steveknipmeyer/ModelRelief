#### Commit       
### General     
    Today
        Remove Jewelry Project?

        Add a busy indicator.
            https://stackoverflow.com/questions/60427408/asp-net-core-busy-indicator-while-downloading-file
            http://johnatten.com/2013/12/22/asp-net-mvc-show-busy-indicator-on-form-submit-using-jquery-and-ajax/

        An OBJ loader exception leaves the Composer in an indeterminate state.
            Add a status panel to Composer for messages.

        How will the Mesh/Model Camera be handled for a new model (before a Mesh has been generated)?
            getBoundingClippingPlanes: nearPlane = -5.132047176361084 (BaseCamera.ts:131)
            FileIsSynchronized?

    Should Post requests also add related resources?
    Should Delete requests also remove related resources?
        Model3d
        Project
    
    Integration Tests   
        Why does AutoRollback not perform a database rollback?              

    Strengthen the OBJ validation.
        https://github.com/stefangordon/ObjParser

    What Create/Edit pages are valid semantically?
        Invalid
            Camera
            NormalMap
            DepthBuffer
            MeshTransform
            Settings
            Session
        Valid
            Mesh
            Model3d
            Project
  
    SMK
        https://www.turbosquid.com/Search/3D-Models/free?exclude_branded=1&exclude_editoriallicense=1&include_artist=SMK-National-Gallery-of-Denmark
        https://www.smk.dk/en/article/digitale-casts/

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

    Projects
        Project DropDowwn Control
            Should the Menu label link to the active project?
                This requires using the dropdown arrow to activate the menu.

        Create Project
            How should a new project be created?
                Projects/Create is the baseline.
    
    Convert Mesh to OBJ default to support download of generated Mesh.

    Profile the startup code.
        Optimize SettingsManager.Initialize[UserSession|Settings]Async
            Every property validation causes a database read.

    Final Height MeshTransform Setting
        Review the description of the control.
            This setting controls the height of the final relief. It is a percentage of the depth of the original model.

    Verify Resolution.Image setting.

    Test new user creation.
        52oCTRbyDVifvQTiSdyn0mkrXwhMiTEe

    Should there be a mechanism to update an <existing> Model3d file?
        Model3d.Edit View

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
        Wrap HttpContext.Session?

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
    Add PostMan ModelRelief collection.
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
        Ux Features not published
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
