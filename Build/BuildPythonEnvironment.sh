#!/bin/bash
# Build the Python virtual environment.

if [ $# -eq 0 ]; then
    echo "usage: $0 [Development | Production]"
    exit
fi

if [ $1 = 'Development' ]; then
echo "Building development environment into devenv"
rm -r devenv
python3 -m venv devenv
source devenv/bin/activate
pip3 install -r requirements.development.txt

elif [ $1 = 'Production' ]; then
echo "Building production environment into mrenv"
rm -r mrenv
python3 -m venv mrenv
source mrenv/bin/activate
pip3 install -r requirements.production.txt
else
    echo "unknown environment: $1"
    exit
fi
