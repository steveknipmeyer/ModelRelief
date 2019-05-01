# !/bin/bash
# Nginx runtime environment

# ModelRelief Folder Locations
export MRSolution=$(pwd)/
export MR=${MRSolution}ModelRelief/
export MRPublish=${MRSolution}Publish/

export PATH="$PATH:${MRPublish}mrenv"

# PYTHON
# include Tools folder for general utility support
export "PYTHONPATH=${MRPublish}Tools:${MRPublish}Solver:$PYTHONPATH"

# Python environment
echo "Activating Production Python environment"
conda activate ${MRPublish}mrenv

# start Nginx web server as reverse proxy
echo "Starting Nginx server"
sudo service nginx start

# start Kestrel NET.Core
echo "Starting Kestrel .NET Core server"
cd $MRPublish
dotnet ModelRelief.dll



