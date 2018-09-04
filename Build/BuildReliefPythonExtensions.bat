:: Builds the Python C++ extensions.
:: usage: BuildReliefPythonExtensions <Development | Production>
@echo off

:: ------------------ Validation ---------------------------::
:: Check command line arguments.
if [%1] == [Development] goto Development
if [%1] == [Production] goto Production
goto InvalidArgs

:Development
set EnvironmentName=devenv
set BuildOptions="--debug"
goto BuildExtensions

:Production
set EnvironmentName=mrenv
set BuildOptions=
goto BuildExtensions

:: ------------------ Build Extensions ---------------------------::
:BuildExtensions
:: set root as default
cd %MRSolution%

:: set up Production Python environement
if %EnvironmentName% == mrenv call activate Publish\mrenv

cd Relief 
python setup.py build %BuildOptions% install

:: restore Development Python environement
if %EnvironmentName% == mrenv call activate ..\devenv
set PROMPT=(Development) $P$G

goto exit

:: ------------------ Exit ---------------------------::
:InvalidArgs
echo usage: BuildReliefPythonExtensions [Development, Production]
goto exit

:exit
cd %MRSolution%
set EnvironmentName=
set BuildOptions=
