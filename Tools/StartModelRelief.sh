#!/bin/bash
# ModelRelief launch
set -

scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/
cd $scriptFolder/..

# ASPNET Core Configuration
# Nginx proxy forwards to https://localhost:5001 (/etc/nginx/sites-available/default)
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS="https://localhost:5001/;http://localhost:5000/"

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
sudo service nginx start

# start Kestrel NET.Core
echo "Starting Kestrel .NET Core server"
dotnet ModelRelief.dll
