#!/bin/bash
# Nginx runtime environment

# PYTHON
# include Tools folder for general utility support
export "PYTHONPATH=Tools:Solver:$PYTHONPATH"

# Python environment
echo "Activating Production Python environment"
. mrenv/bin/activate

# start Nginx web server as reverse proxy
echo "Starting Nginx server"
#sudo service nginx start

# start Kestrel NET.Core
echo "Starting Kestrel .NET Core server"
dotnet ModelRelief.dll



