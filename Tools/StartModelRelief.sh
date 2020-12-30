#!/bin/bash
# ModelRelief launch

scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/
cd $scriptFolder/..

# ASPNET Core Configuration
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS="https://localhost:443/;http://localhost:80/"
#export ASPNETCORE_URLS="https://localhost:5001/;http://localhost:5000/"

# ModelRelief Configuration
export MR=$(pwd)
export MRDatabaseProvider=SQLite
export MRUpdateSeedData=False
export MRInitializeDatabase=False
export MRSeedDatabase=False
export MRExitAfterInitialization=False

# Python environment
echo "Activating Production Python environment"
. mrenv/bin/activate

# include Tools folder for general utility support
export "PYTHONPATH=Tools:Solver:$PYTHONPATH"

# start Nginx web server as reverse proxy
echo "Starting Nginx server"
service nginx start

# start Kestrel NET.Core
echo "Starting Kestrel .NET Core server"
# https://stackoverflow.com/questions/8633461/how-to-keep-environment-variables-when-using-sudo
sudo -E bash -c 'dotnet ModelRelief.dll'

