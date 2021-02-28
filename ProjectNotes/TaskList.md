## Commit Notes

#### General      
    Projects
        What kind of UI control can be used to switch Projects?
            A drop-down menu in the _Layout header?
            https://jsfiddle.net/xnpf1rr9/

        How should a new project be created?
            Projects/Create is the basis.

        Use Index page as a template for the Project page.
            Each user model is hosted in a tile.
                Add a new endpoint mesh/preview for a preview image of the mesh. 
                Create using the Canvas image of the last generated Mesh.  

        Add support for creating mesh "thumbnails" from the mesh canvas.
            mesh/{id}/thumbnail
            
        Place sample projects into a single project?

    Upload

    Test new user creation.
        52oCTRbyDVifvQTiSdyn0mkrXwhMiTEe
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