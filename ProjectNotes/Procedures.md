# Procedures
###  WSL
    https://www.howtogeek.com/426562/how-to-export-and-import-your-linux-systems-on-windows-10/
    wsl --export Ubuntu-20.04 MR.tar
    wsl --unregister Ubuntu-20.04

    Install Ubuntu 20.04 from Microsoft Store.
    
    /etc/hosts
        Add modelrelief Linode entry.
        45.79.166.83    modelrelief

    ~/.ssh
        Copy private keys to SSH folder.
            id_rsa
            id_rsa.pub
    
    Ubuntu Update
        sudo apt update
        sudo apt upgrade

    .bashrc
        Add to end of .bashrc.
            # https://techcommunity.microsoft.com/t5/windows-dev-appconsult/running-wsl-gui-apps-on-windows-10/ba-p/1493242
            export WSLAddress=`grep nameserver /etc/resolv.conf | sed 's/nameserver //'`
            export DISPLAY=$WSLAddress:0
            echo WSL IPv4 address = $WSLAddress
            export XDG_RUNTIME_DIR=/tmp/runtime-stephen

            # Solver OBJ output
            export MRTemp=/mnt/c/Users/steve/Documents/Temp/

            # ModelRelief development shell
            . ~/projects/ModelRelief/Tools/ModelReliefShell.sh
###  Linode
    Namecheap
        Add Linode DNS server names to the domain.

    Domain Setup
        N.B. No changes were necessary. Adding only the Linode DNS servers to the Namecheap records was sufficient.
        https://www.linode.com/docs/guides/dns-manager/

    E-mail
        Add MX, TXT DNS records as provided by Namecheap.
        https://www.linode.com/community/questions/17732/how-to-configure-dns-for-namecheap-private-email

    SSL Configuration
        Let's Encrypt SSL
        https://www.linode.com/docs/guides/secure-website-lets-encrypt-acme-sh/
        HTTPS Redirect
        https://www.linode.com/docs/guides/enable-tls-on-nginx-for-https-connections/        
###  Linode Production Server Setup   
    Nginx
        https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
        https://www.linode.com/docs/guides/how-to-install-nginx-ubuntu-18-04/
        https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-3.1
       
        sudp apt install nginx
        
        sudo unlink /etc/nginx/sites-enabled/default
        sudo cp ~/modelrelief/nginx/modelrelief.org /etc/nginx/sites-available
        sudo ln -s /etc/nginx/sites-available/modelrelief.org /etc/nginx/sites-enabled

        Configure the maximum file upload size to avoid 413 Request Entity Too Large error during upload. Add the following line to the end of the 'http' configuration block in /etc/nginx/nginx.conf.
        https://blog.hubspot.com/website/413-request-entity-too-large?toc-variant-b=

                # ModelRelief: maximum file upload
                client_max_body_size 24M;

    .NET SDK and Runtime 3.1
        https://docs.microsoft.com/en-us/dotnet/core/install/linux-ubuntu

    SQLite
        sudo apt-get install sqlite3

    SSL
        Generate a developer SSL certificate. 
        N.B. The SDK is required to use the dev-certs tool.
            dotnet dev-certs https

    Nginx Server
        # Nginx proxy forwards to Kestrel at https://localhost:5001 (/etc/nginx/sites-available/default)
        source ~/modelrelief/Tools/StartModelRelief.sh

    Test
        wget -p --no-check-certificate http://localhost:5000
###  Linode Deployment
    python Build/Builder.py --publish True

    Deploy
        N.B. Check --exclude arguments for exclusions.
        . /Tools/deploy user@modelrelief

    Bind Python virtual environment to server PATHS
        ./Tools/BindPythonEnvironment.sh mrenv
### Adding a New GeneratedFileDomainModel (e.g. NormalMap)
#### Documentation
- [ ] Update the class hierarchies in TechnicalNotes.md.
#### Configuration
- [ ] Add the paths to the new model folders in appsettings.json (e.g. Paths:ResourceFolders:NormalMaps).
#### Dispatcher
- [ ] Extend IDispatcher to include a generation method for the new entity (e.g. GenerateNormalMapAsync).
- [ ] Add support for generating the file after dependencies have changed. (e.g. GenerateNormalMapAsync).
#### Domain
- [ ] Add the database ModelRelief.Domain schema class (e.g. NormalMap.cs).
#### Database
- [ ] Delete the existing databases
- [ ] Add the new entity type to ModelReliefDbContext.cs.
- [ ] Add the new model types to DbInitializer including support for updating the seed files (UpdateSeedData)
#### Test Files
- [ ] Add the new model folder type to Test/Data/Users including at least one placeholder file to ensure the output folder will be created.
#### Api
- [ ] Add request handlers to the V1 folder (e.g. Api/V1/NormalMaps)
- [ ] Add API definitions for the new model to ApiErrors.cs.
#### Features
- [ ] Add the new controller. (e.g. Features/NormalMaps/NormalMapsController.cs)
- [ ] Add the new DTO model (e.g. NormalMap.cs)
- [ ] Add the supporting Razor pages (e.g. Create.cshtml)
- [ ] Add the new entity type to the main navigation bar (_Layout.cshtml).
#### Scripts
- [ ] Add the interface to Api/V1/Interfaces (e.g. INormalMap.ts).
- [ ] Add the new concrete class implementing the interface to DtoModels.ts.
- [ ] Add the necessary application graphics model to Models (e.g. Models/NormalMap/NormalMap.ts).
<br>*If the entity is graphical:*
- [ ] Add a new viewer to Viewers (e.g. Viewers/NormalMapViewer.ts)
- [ ] Add an MVC View to Views (e.g. Views/NormalMapView.ts)
- [ ] Add the HTML View to Composer/Edit.cshtml.
- [ ] Create the factory (e.g. NormalMapFactory) to construct the entity.
- [ ] Extend ComposerController to add support for generating the new entity.

#### XUnit Integration Tests
- [ ] Add the model Base support to Integration/Base (e.g. NormalMapsBaseIntegration.cs)
- [ ] Add the model File support to Integration/File (e.g. NormalMapsFileIntegration.cs)
- [ ] Add the test model factory support to TestModelFactores (e.g. NormalMapTestModelFactory.cs)
#### TypeScript Unit Tests
- [ ] Add tests supporting the new entity to UnitTests.ts.
#### Postman
- [ ] Add test requests to support the new entity,
#### Solver
- [ ] Add a new Python class (e.g. normalmap.py).
#### Tools
- [ ] Add utilities as needed (e.g. normalmapwriter.py)
#### Explorer
- [ ] Add support as required.
### Schema Modifications
#### Front End
- [ ] Add the new properties to the DTO interfaces, eg. IDepthBuffer.
- [ ] Add the new properties to the DTO classes, eg. Dto.DepthBuffer.
- [ ] Add the new properties to the Graphic classes, eg. DepthBuffer.
- [ ] Modify the graphics class methods fromDto and toDto.
- [ ] Razor Pages
- [ ] Include the new (required) properties in any POST requests.
- [ ] Extend the Composer UI to include the new properties.

#### Back End
##### Domain Models
- [ ] Add new properties to the class in the Domain folder.
##### DTO Models (Features/<Models>)
- [ ] Add new properties to the class.
- [ ] Extend the AbstractValidator/<Model> to add new validation rules for the properties.
##### DbInitializer
- [ ] Add the properties to the instance initializers of the Add/<Model> methods.
OR
- [ ] Add the properties to the JSON initialize files in Test/Data/Users/<model>
##### Explorer (MeshTransform only)
- [ ] Add the new MeshTransform properties to the UI.
- [ ] Extend Explorer to process the new property in initialization, settings update, etc.
##### Solver (MeshTransform only)
- [ ] Extend the relevant Python class (e.g. DepthBuffer) to include the new properties
##### Testing
- [ ] Add the new properties to the ConstructValidModel method of the /<Model>TestModelFactory class.
- [ ] Run the unit tests.
- [ ] Update the Solver/Test JSON files using MRUpdateSeedData.
##### Schema
- [ ] Update ModelRelief.dgml schema diagram.

### Adding a New Test Model
    For a new Project, add an empty Project entry in SeedContent.json.

    ModelRelief
        Create a new Model3d and upload the OBJ file.
            The model name must end with ".obj".
        Generate a new Mesh.

    Add the new model to SeedContent.json.    

    Set UpdateSeedData and restart ModelRelief.
        The DepthBuffer, Mesh, Model3d and NornalMap files will be added to ModelRelief/Test/Data/Users.
        N.B. In the expoerted JSON, the new model will have the largest Id because it is the newest model.

    Set UpdateSeedData and restart ModelRelief.
        The seed JSON files will be exported to ModelRelief/Test/Data/Users and Solver/Test.
        N.B. The entity Ids are now correct in the exported Cameras.json and MeshTransforms.json files.
### Test Checklist
    Test Checklist
        testrunner (XUnit)          python Tools/testrunner.py
        Builder
            Development             python Build/Builder.py --target local
            Publish                 python Build/builder.py --publish True
        Postman
        Explorer                    python Explorer/explorer.py --s ../Solver/Test/discus.json --w ../Solver/Test/Working
        Solver                      python Solver/solver.py --s "Test/discus.json" --w "Test/Working"
