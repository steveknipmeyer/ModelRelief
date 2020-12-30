#!/bin/bash
# ModelRelief launch

# ASPNET Core Configuration
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS="https://localhost:443/;http://localhost:80/"

# ModelRelief Configuration
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
#sudo service nginx start

# start Kestrel NET.Core
echo "Starting Kestrel .NET Core server"
dotnet ModelRelief.dll



