#!/bin/bash
# Builds the Python C++ extensions.
# usage: BuildReliefPythonExtensions <Development | Production>
echo BuildReliefPythonExtensions
echo '$0'=$0
echo '$1'=$1
echo '$2'=$2

if [ $# -eq 0 ]; then
    echo "usage: $0 [Development | Production]"
    exit
fi

if [ $1 = 'Development' ]; then
    EnvironmentName=devenv
    BuildOptions="--debug"
elif [ $1 = 'Production' ]; then
    EnvironmentName=mrenv
    BuildOptions=
else
    echo "unknown environment: $1"
    exit
fi

# ------------------ Build Extensions ---------------------------::
# set root as default
cd $MRSolution

# set up Production Python environement
if [ $EnvironmentName = "mrenv" ]; then
    echo "Activating production (mrenv) Python environment"
    # https://github.com/conda/conda/issues/7980
    source ~/anaconda3/etc/profile.d/conda.sh
    conda activate Publish/mrenv
 fi

cd Relief
python setup.py build $BuildOptions install

# restore Development environment
cd ..
if [ $EnvironmentName = "mrenv" ]; then
    echo "Restoring developoment (devenv) Python environment"
    # https://github.com/conda/conda/issues/7980
    source ~/anaconda3/etc/profile.d/conda.sh
    conda activate ./devenv
 fi
