## Commit Notes

#### General       
    Expand CamersSettings.json -> DefaultSettings.json
        DefaultSettings.json provides defaults for Settings.

    settings/camera -> settings/default
    DefaultCameraSettings -> DefaultSettings.Camera


    DbInitializer: FindByName must filter by project.
       
    Optimize SettingsManager.Initialize[UserSession|Settings]Async
        Every property validation causes a database read.

    Projects

        Default Constructors
            Camera
            DepthBuffer
            Mesh
            MeshTransform
            Model3d
            NormalMap
            Project
            Settings
            Session

        Projects
            New Model
                Add support for creating supporting resources for a new model.               
            projects.ForEach
            {
                Mesh
                    MeshTransform            
                    DepthBuffer
                        Camera
                        Model
                            Camera
                    Camera
            }


        Project Control
            Should the Menu label link to the active project?
                This requires using the dropdown arrow to activate the menu.

        Create Project
            How should a new project be created?
                Projects/Create is the basis.

        Project Details
            Use Index page as a template for the Project page.
                Each user model is hosted in a tile.

            Add support for creating mesh "thumbnails" from the
             mesh canvas.
                mesh/{id}/thumbnail
                Add a new endpoint mesh/preview for a preview image of the mesh. 
                Create using the Canvas image of the last generated Mesh.  


            Create View        
                Why is the FormFile binding lost?
                    The focus has to leave the input field.

                Style the Create page.

            Add validation for the FormFile.
                /home/stephen/projects/AspNetCore.Docs/aspnetcore/mvc/models/file-uploads/samples/3.x/SampleApp
                How can an OBJ file be validated?
                    The back end should assign the Format only after validation.
                Assign Format to model based on file content.

    Test new user creation.
        52oCTRbyDVifvQTiSdyn0mkrXwhMiTEe

    Reference properties override the foreign key if different.
        True only for PUT or all HTTP? 

    Why is it (intermittently) necessary to run ModelRelief before testrunner?
        testrunner does initiialize the database....
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
            The Solver could mark the output mesh has invalid amd emcode the status result in the contents.
        Should the GeneratedFile be deleted if the Solver fails?
        Generate result
            Result
            Processing time
            Polygons

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
