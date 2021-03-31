# Procedures

###  Linux Setup

    .NET Core
        Install .Net Core 3.1 SDK
        dotnet tool install --global dotnet-ef
    
    C++
        sudo apt-get install build-essential gdb
    
    CMake
        sudo apt install cmake
    
    git
        sudo apt install git
        git config --global user.name "Steve Knipmeyer"
        git config --global user.email "steve@knipmeyer.org"
    
        git clone https://github.com/steveknipmeyer/ModelRelief.git
        Store credentials.
            cd ModelRelief
            git config credential.helper store
    
        Pull Pybind11 and Catch2 repos.
            git submodule init
            git submodule update
    
    Python (3.8.5)
        See requirements.development.txt.For setup instructions.
    
    Node
        sudo apt install nodejs
    
    NPM
        sudo apt install npm
        npm install
        sudo npm install --global gulp-cli
        sudo npm install --global madge
    
    .NET Core
        https://docs.microsoft.com/en-us/dotnet/core/install/linux
        dotnet restore
        dotnet build ModelRelief
    
    SQLite
        sudo apt-get install sqlite3 (if required)
        sudo apt-get install sqlitebrowser
    
    Runtime
        Add azurekeyvault.json to ModelRelief project folder.

    Build
        Build/BuildPythonEnvironment.sh Development
        python Build/Builder.py --target local
    
    Test
        python Tools/testrunner.py
    
    nginx
        https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
        https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-3.1
    
        sudo cp nginx/default /etc/nginx/sites-available/default
    
        source Tools/StartModelRelief.sh
    
        Start browser using https://localhost:80
            Nginx proxy forwards to https://localhost:5001 (/etc/nginx/sites-available/default)

#### Explorer

    devenv/lib/python3.8/site-packages/qt5_applications/Qt/bin/designer Explorer/explorer.ui

### Adding a New GeneratedFileDomainModel (e.g. NormalMap)

#### Documentation
- [X] Update the class hierarchies in TechnicalNotes.md.
#### Configuration
- [X] Add the paths to the new model folders in appsettings.json (e.g. Paths:ResourceFolders:NormalMaps).
#### Dispatcher
- [x] Extend IDispatcher to include a generation method for the new entity (e.g. GenerateNormalMapAsync).
- [x] Add support for generating the file after dependencies have changed. (e.g. GenerateNormalMapAsync).
#### Domain
- [X] Add the database ModelRelief.Domain schema class (e.g. NormalMap.cs).
#### Database
- [X] Delete the existing databases
- [X] Add the new entity type to ModelReliefDbContext.cs.
- [X] Add the new model types to DbInitializer including support for updating the seed files (UpdateSeedData)
#### Test Files
- [X] Add the new model folder type to Test/Data/Users including at least one placeholder file to ensure the output folder will be created.
#### Api
- [X] Add request handlers to the V1 folder (e.g. Api/V1/NormalMaps)
- [X] Add API definitions for the new model to ApiErrors.cs.
#### Features
- [X] Add the new controller. (e.g. Features/NormalMaps/NormalMapsController.cs)
- [X] Add the new DTO model (e.g. NormalMap.cs)
- [X] Add the supporting Razor pages (e.g. Create.cshtml)
- [X] Add the new entity type to the main navigation bar (_Layout.cshtml).
#### Scripts
- [X] Add the interface to Api/V1/Interfaces (e.g. INormalMap.ts).
- [X] Add the new concrete class implementing the interface to DtoModels.ts.
- [X] Add the necessary application graphics model to Models (e.g. Models/NormalMap/NormalMap.ts).
<br>*If the entity is graphical:*
- [X] Add a new viewer to Viewers (e.g. Viewers/NormalMapViewer.ts)
- [X] Add an MVC View to Views (e.g. Views/NormalMapView.ts)
- [X] Add the HTML View to Composer/Edit.cshtml.
- [ ] Create the factory (e.g. NormalMapFactory) to construct the entity.
- [ ] Extend ComposerController to add support for generating the new entity.

#### XUnit Integration Tests
- [X] Add the model Base support to Integration/Base (e.g. NormalMapsBaseIntegration.cs)
- [X] Add the model File support to Integration/File (e.g. NormalMapsFileIntegration.cs)
- [X] Add the test model factory support to TestModelFactores (e.g. NormalMapTestModelFactory.cs)
#### TypeScript Unit Tests
- [ ] Add tests supporting the new entity to UnitTests.ts.
#### Postman
- [X] Add test requests to support the new entity,
#### Solver
- [ ] Add a new Python class (e.g. normalmap.py).
#### Tools
- [ ] Add utilities as needed (e.g. normalmapwriter.py)
#### Explorer
- [ ] Add support as required.

### Test Checklist
    Test Checklist
        testrunner (XUnit)          python Tools/testrunner.py
        Builder
            Development             python Build/Builder.py --target local
             Nginx                  python Build/builder.py --target nginx --deploy True
        Postman
        Explorer                    python Explorer/explorer.py --s ../Solver/Test/Lucy.json --w ../Solver/Test/Working
        Solver                      python Solver/solver.py --s "Test/House.json" --w "Test/Working"

### dotnet run
**The 'dotnet run' workflow runs using the first 'Project' configuration in Properties/launchSettings.json.  **
The ordering in launchSettings.json controls whether the configuratIon is 'Production' or 'Development'.

### Schema Modifications

#### Front End
- [X] Add the new properties to the DTO interfaces, eg. IDepthBuffer.
- [X] Add the new properties to the DTO classes, eg. Dto.DepthBuffer.
- [X] Add the new properties to the Graphic classes, eg. DepthBuffer.
- [X] Modify the graphics class methods fromDto and toDto.
- [ ] Razor Pages
- [ ] Include the new (required) properties in any POST requests.
- [ ] Extend the Composer UI to include the new properties.

#### Back End
##### Domain Models
- [x] Add new properties to the class in the Domain folder.
##### DTO Models (Features/<Models>)
- [x] Add new properties to the class.
- [x] Extend the AbstractValidator/<Model> to add new validation rules for the properties.
##### DbInitializer
- [ ] Add the properties to the instance initializers of the Add/<Model> methods.
OR
- [X] Add the properties to the JSON initialize files in Test/Data/Users/<model>
##### Explorer (MeshTransform only)
- [X] Add the new MeshTransform properties to the UI.
- [X] Extend Explorer to process the new property in initialization, settings update, etc.
##### Solver (MeshTransform only)
- [X] Extend the relevant Python class (e.g. DepthBuffer) to include the new properties
##### Testing
- [X] Add the new properties to the ConstructValidModel method of the /<Model>TestModelFactory class.
- [ ] Run the unit tests.
- [ ] Update the Solver/Test JSON files using MRUpdateSeedData.
##### Schema
- [ ] Update ModelRelief.dgml schema diagram.

#### Git
    Git Configuration: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
    git config --list

|Configuration File|Linux|Note
|----|----|----|
|system|/etc/gitconfig||
|system|||
|user|~/.gitconfig||
|user|~/.config/git/config|
|project|.git/config||

#### Adding a New Test Model
    For a new Project, add an empty Project entry in SeedContent.json.

    ModelRelief
        Create a new Model3d and upload the OBJ file.
            The model name must end with ".obj".
        Generate a new Mesh.

    Set UpdateSeedData and restart ModelRelief.
        The DepthBuffer, Mesh, Model3d and NornalMap files will be added to ModelRelief/Test/Data/Users.
        The seed JSON files will be exported to ModelRelief/Test/Data/Users and Solver/Test.

    Add the new model to SeedContent.json.    
       
