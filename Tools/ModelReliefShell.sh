#!/bin/bash
# ModelRelief Development Shell

scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/
cd $scriptFolder/..

# ModelRelief Folder Locations
export MRSolution=$(pwd)/
export MR=${MRSolution}ModelRelief/
export MRPublish=${MRSolution}Publish/

# ModelRelief Settings
# Settings are <overridden> by these configuration providers in order:
#             Source                                                           Note
#             ------                                                           ----
#             appsettings.json                                                 no MR settings
#             appsettings.<Environment>.json                                   no MR settings
#             ModelRelief/Properties/launchSettings.json                       disable with --no-launch-profile, VSCode launch.json is <only> used when launching from VSCode
#             environment variables                                            shell definitions
#             command line parameters                                          dotnet run -p ModelRelief --Variable=Value
# https://blogs.msdn.microsoft.com/premier_developer/2018/04/15/order-of-precedence-when-configuring-asp-net-core/
# The last key loaded wins.

# N.B. These environment settings are the <only> settings used by XUnit (Visual Studio or 'dotnet test')
#       because ModelRelief.Test does <not> have an appsettings.json or Properties/launchSettings.json.
# N.B. 'dotnet run' uses ModelRelief/Properties/launchSettings.json!
#       https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-run?tabs=netcore21
#       Disable with 'dotnet run --no-launch-profile'.

# ASPNET Core Configuration
export ASPNETCORE_ENVIRONMENT=Development
export ASPNETCORE_URLS="https://localhost:5001/;http://localhost:5000/"

# ModelRelief Configuration
export MRDatabaseProvider=SQLite
export MRUpdateSeedData=False
export MRInitializeDatabase=False
export MRSeedDatabase=False
export MRExitAfterInitialization=False

# Python environment
echo "Activating Development Python environment"
. devenv/bin/activate

# include Tools folder for general utility support
export "PYTHONPATH=${MRSolution}Tools:${MRSolution}Solver:${MRSolution}Explorer:$PYTHONPATH"
# MyPy Linter
export "MYPYPATH=${MRSolution}Tools/"

export PATH="$PATH:${MRSolution}Tools:${MRSolution}Build"

MRHome () {
  cd $MRSolution
}

showenv.sh
