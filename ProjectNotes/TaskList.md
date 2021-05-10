#### Commit     
### General     
    Today   
        Styling
            SASS
            Udemy Bootstrap course
            Style the View.
            Style the ProgressBar
                Increase the default width of the Progress Bar.
                Increase the height.

        Runtime error does not propagate back to UI.        
            Should Composer check IsFileSynchronized?
            Add a status widget to show processing progress obtained by GET of GeneratedFileModel metadata.
                Polling is done based on a timer.

            Generate result
                Result
                Processing time
                Polygons                   

    Strengthen the OBJ validation.
        https://github.com/stefangordon/ObjParser

    Profile the startup code.
        Optimize SettingsManager.Initialize[UserSession|Settings]Async
            Every property validation causes a database read.

    Verify Resolution.Image setting.

    How is a Mesh dependent on the Camera?
        The camera clipping planes are used to scale from normalized DB units to Model3d units.

    Should Post requests also add related resources?
    Should Delete requests also remove related resources?
        Model3d
        Project
    
    Should there be a mechanism to update an <existing> Model3d file?
        Model3d.Edit View

    Reduce model sizes in MeshLab!
        remote: warning: File ModelRelief/Test/Data/User/models/roadster/roadster.obj is 62.69 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
        remote: warning: File ModelRelief/Test/Data/User/models/statue/statue.obj is 53.92 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB

    Why is it (intermittently) necessary to run ModelRelief before testrunner?
        testrunner does initialize the database....
        Restore logic?

    Investigate Chrome page warnings.
        Compose has multiple progressBar ids.
        
    Session    
        Wrap HttpContext.Session?
#### Models
    OBJ viewer has missing polygons.
        Plunderbuss
        House

    Review all mesh generation settings for delivered models.
    Attenuation Decay.
        It is 0.9 in the thesis but there are values of 0.6 in the sample data set.
#### Solver
    Silhouette
        Blend profile into mesh form.
#### UI
    Create a video or an animation?
    Workflow page
        Illustrate with images from Explorer!
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
#### Build
    Prove with clean Ubuntu installation!
        Add a test account.
### Security
    Remove steve@knipmeyer.org.
    Azure Key Secrets
        Review settings in AzureKeyVault.
        Mock azurekeysecrets.json.
            Move to a new settings file?           
### Refactoring
    Review all casing of files and directories.
    Tools -> tools
### Project
    Structure GitHub repo using recommended best practices.
    Add OneNote ModelRelief notebook.
    Add PostMan ModelRelief collection.
    Documentation
        Document DepthBufferView and analyze tools (e.g. HtmlLogger).
        Document VcXsrv
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
            developmentui
        Ux Features not published
            clipping planes
            perspective cameras
        API
        ModelRelief.dgml (Linux?)
### Publishing
    KAK invitation
    Notices:
        3D CAD Jewelry
            https://matrixusergroup.com/
        CNC
        ArtCAM
        Vectrix
        3D Printing
        HackerNews
### License
    Replace copyright headers with MIT license notice.
