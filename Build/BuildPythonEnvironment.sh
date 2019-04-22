#!/bin/bash
# Build the Python virtual environment.

if [ $# -eq 0 ]; then
    echo "usage: $0 [Development | Production]"
    exit
fi

if [ $1 = 'Development' ]; then
echo "Building development environment into devenv"
conda create --yes --prefix devenv --file ./requirements.development.txt

elif [ $1 = 'Production' ]; then
echo "Building production environment into mrenv"
conda create --yes --prefix mrenv --file ../requirements.production.txt
else
    echo "unknown environment: $1"
    exit
fi
