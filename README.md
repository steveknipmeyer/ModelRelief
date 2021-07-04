# ModelRelief

Conversion of 3D models to low relief meshes using image processing.

Description: A description of your project follows. A good description is clear, short, and to the point. Describe the importance of your project, and what it does.
Features
 - 1
 - 2
## Table of Contents: 
Optionally, include a table of contents in order to allow other people to quickly navigate especially long or detailed READMEs.

## Development
###  Linux Setup
#### git
```
sudo apt install git
git clone https://github.com/steveknipmeyer/ModelRelief.git

# Pull and initialize Pybind11 and Catch2 repos used for Python C++ relief extension.
git submodule init
git submodule update
```    
#### .NET Core 3.1 SDK  
Follow the instructions to install the .NET 3.1 SDK here:   
https://docs.microsoft.com/en-us/dotnet/core/install/linux-ubuntu

Also install the CLI extensions for Entity Framework.
```
dotnet tool install --global dotnet-ef
```

#### C++
Install standard tools for building C++, used for Python relief extension.
```
sudo apt-get install build-essential gdb
``` 
#### CMake
Install the make tools used for bulding the Python relief extension.
```
sudo apt install cmake
``` 

#### Node.js
````
sudo apt install nodejs
````
#### NPM 
````
sudo apt install npm
npm install
# gulp tasks
sudo npm install --global gulp-cli
# TypeScript circular depedency tool
sudo npm install --global madge
# SASS compiler
sudo npm install --unsafe-perm -g node-sass
````
#### SQLite Database
```
sudo apt-get install sqlite3 (if required)
sudo apt-get install sqlitebrowser
```
#### Python
```
# Python virtual enviroment
sudo apt-get install python3-venv
# development tools
sudo apt install python3-dev

```  
#### Runtime
Create azurekeyvault.json in the ModelRelief folder. See the [Azure Key Store](./ProjectNotes/TechnicalNotes.md#azure-key-store) in [TechnicalNotes.md](./ProjectNotes/TechnicalNotes.md) for the expected key-value pairs.
```json
{
  "AzureKeyVault": {
    "Vault": "Your Vault Id",
    "ApplicationId": "Your Application Id",
    "ModelReliefKVKey": "Your Client Secret"
  }
}
```
#### Python Virtual Environment
Build the Python development environment.
```
Build/BuildPythonEnvironment.sh Development devenv
```
Activate the environment.
```
. devenv/bin/activate
```

#### ModelRelief DevelopmentShell
Set up your development environment by invoking [ModelReliefShell.sh](./Tools/ModelReliefShell.sh). You will probably want to do this as part of your login initialization. 
```
. ./Tools/ModelReliefShell.sh
```
###  Building ModelRelief
#### Build
```
python Build/Builder.py --target local
``` 
#### Test Suite
```
python Tools/testrunner.py
``` 

## Usage
Usage: The next section is usage, in which you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Credits

Credits: Include a section for credits in order to highlight and link to the authors of your project.
## License
[MIT](MIT-License.md)


![Landing](ModelRelief/Documentation/README/Images/Landing.jpg)

