#!/bin/bash
# Build the Python virtual environment.
#set -x

if [ $# -eq 0 ]; then
    echo "usage: $0 [Development | Production] <path to virtual environment>"
    exit
fi

function create_environment() {
    # $1 : path (absolute or relative) to new virtual environment
    # $2 : configuration (development | production)
    echo "Building $2 environment into $1"
    python3 -m venv --clear $1
    source $1/bin/activate
    pip3 install -r requirements.$2.txt
}

if [ $1 = 'Development' ]; then
     create_environment $2 development
    # The virtual environment does not include the headers so copy them. [Why?]
    cp -r /usr/include/python3.8/ devenv/include
elif [ $1 = 'Production' ]; then
    create_environment $2 production
else
    echo "unknown environment: $1"
    exit
fi
