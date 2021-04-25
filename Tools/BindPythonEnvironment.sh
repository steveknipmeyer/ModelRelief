#!/bin/bash
# Bind a (copied) virtual environment to the local machine.
# Script must be run from the parent folder of the virtual environment.

#set -x

if [ $# -eq 0 ]; then
    echo "usage: $0 <venv folder (e.g. 'mrenv')>"
    exit
fi

# ensure symbolic links are correct
ln -sf /usr/bin/python3 $1/bin/python3

# set VIRTUAL_ENV to local paths
venv_dir="$(pwd)/$1"
sed -i "s|VIRTUAL_ENV=.*|VIRTUAL_ENV=$venv_dir|" $1/bin/activate
