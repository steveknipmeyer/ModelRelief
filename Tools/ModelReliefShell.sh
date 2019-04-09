# !/bin/bash
# ModelRelief Development Shell

# ModelRelief Folder Locations
export MRSolution=$(pwd)/
export MR=${MRSolution}ModelRelief/
export MRPublish=${MRSolution}Publish/

# ModelRelief Settings
# Settings are <overridden> by these configuration providers in order:
#             Source                                                           Note
#             ------                                                           ----
#             environment variables                                            shell definitions
#             appsettings.json                                                 no MR settings
#             appsettings.<Environment>.json                                   no MR settings
#             ModelRelief\launchSettings.json                                  disable with --no-launch-profile, VSCode launch.json is <only> used when launching from VSCode
#             command line parameters                                          dotnet run -p ModelRelief --Variable=Value
# https://blogs.msdn.microsoft.com/premier_developer/2018/04/15/order-of-precedence-when-configuring-asp-net-core/
# The last key loaded wins.

# N.B. These environment settings are the <only> settings used by XUnit (Visual Studio or 'dotnet test')
#       because ModelRelief.Test does <not> have an appsettings.json or Properties/launchSettings.json.
# N.B. 'dotnet run' uses ModelRelief\Properties\launchSettings.json!
#       https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-run?tabs=netcore21
#       Disable with 'dotnet run --no-launch-profile'.
export MRPort=5000
export MRPortSecure=5001
export MRDatabaseProvider=SQLServer
export MRUpdateSeedData=False
export MRInitializeDatabase=False
export MRSeedDatabase=False
export MRExitAfterInitialization=False

export PATH="$PATH:${MRSolution}Tools:${MRSolution}Build"

# PYTHON
# include Tools folder for general utility support
export "PYTHONPATH=${MRSolution}Tools:${MRSolution}Solver:${MRSolution}Explorer:$PYTHONPATH"
# MyPy Linter
export "MYPYPATH=${MRSolution}Tools/"

# Active the ModelRelief Python environment.
#conda init bash
#conda activate ./devenv

# ASPNET CORE Configuration
export ASPNETCORE_ENVIRONMENT=Development
# Ports Configuration
#  Command line (dotnet run) : ASPNETCORE_URLS environment variable
#  Visual Studio             : launchSettings.json
#  VSCode                    : launch.json
# https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?tabs=aspnetcore2x#useurls-limitations
export "ASPNETCORE_URLS=https://localhost:$MRPortSecure/:http://localhost:$MRPort/"
export "ASPNETCORE_HTTPS_PORT=$MRPortSecure"

echo --- Environment ---
echo MR=$MR
echo ASPNETCORE_URLS=$ASPNETCORE_URLS
echo ASPNETCORE_HTTPS_PORT=$ASPNETCORE_HTTPS_PORT
echo
echo ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
echo MRDatabaseProvider=$MRDatabaseProvider
echo
echo MRUpdateSeedData=$MRUpdateSeedData
echo MRInitializeDatabase=$MRInitializeDatabase
echo MRSeedDatabase=$MRSeedDatabase
echo MRExitAfterInitialization=$MRExitAfterInitialization
