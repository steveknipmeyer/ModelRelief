:: Builds a Python virtual environment.
:: usage: BuildPythonEnvironment <Development | Production>
echo off

:: ------------------ Validation ---------------------------::
:: Check command line arguments.
if [%1] == [Development] goto Development
if [%1] == [Production] goto Production
goto InvalidArgs

:Development
set EnvironmentName=devenv
set RequirementsFile=%MRSolution%requirements.development.conda.txt
echo The development environement must be installed manually. See Logs\DevelopmentPythonInstallation.txt.
goto exit

:Production
set EnvironmentName=mrenv
set RequirementsFile=%MRSolution%requirements.production.txt
goto BuildEnvironment

:: ------------------ Build ---------------------------::
:BuildEnvironment

:: remove
::conda env remove --yes --prefix %EnvironmentName% 

:: create
call conda create --yes --prefix %EnvironmentName% --file %RequirementsFile%

:Summary
echo.
echo The Anaconda environment '%EnvironmentName%' has been created.
echo EnvironmentNme = %EnvironmentName%
echo Requirements   = %RequirementsFile%
goto exit

:: ------------------ Exit ---------------------------::
:InvalidArgs
echo usage: BuildPythonEnvironment [Development, Production]
goto exit

:exit
set EnvironmentName=
set RequirementsFile=
