echo off
title ModelRelief Shell

:: move up from Tools folder to solution root
echo %~dp0
cd/D %~dp0\..

:: ModelRelief Folder Locations
set MRSolution=%cd%\
set MR=%MRSolution%ModelRelief\
set MRPublish=%MRSolution%Publish\
echo MRSolution=%MRSolution%

:: ModelRelief Settings
:: Settings are <overridden> by these configuration providers in order:
::             Source                                                           Note
::             ------                                                           ----
::             environment variables                                            shell definitions
::             appsettings.json                                                 no MR settings
::             appsettings.<Environment>.json                                   no MR settings
::             ModelRelief\launchSettings.json                                  disable with --no-launch-profile, VSCode launch.json is <only> used when launching from VSCode
::             command line parameters                                          dotnet run -p ModelRelief --Variable=Value
:: https://blogs.msdn.microsoft.com/premier_developer/2018/04/15/order-of-precedence-when-configuring-asp-net-core/
:: The last key loaded wins.

:: N.B. These environment settings are the <only> settings used by XUnit (Visual Studio or 'dotnet test')
::       because ModelRelief.Test does <not> have an appsettings.json or Properties/launchSettings.json.
:: N.B. 'dotnet run' uses ModelRelief\Properties\launchSettings.json!
::       https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-run?tabs=netcore21
::       Disable with 'dotnet run --no-launch-profile'.
set MRPort=5000
set MRPortSecure=5001
set MRDatabaseProvider=SQLServer
set MRUpdateSeedData=False
set MRInitializeDatabase=False
set MRSeedDatabase=False
set MRExitAfterInitialization=False

path=%path%;%CD:~0,2%%HOMEPATH%\Documents\Bin
path=%path%;%MRSolution%Tools;;%MRSolution%Build
path=%path%;C:\Program Files\Git
path=%path%;C:\Program Files (x86)\WinMerge
path=%path%;C:\Program Files\KDiff3

call "C:\Program Files\nodejs\nodevars.bat"

:: PYTHON
:: latest Python 3.X; Windows Python launcher (py.exe)
set PY_PYTHON=3
:: include Tools folder for general utility support
set PYTHONPATH=%MRSolution%Tools;%MRSolution%Solver;%PYTHONPATH%
:: MyPy Linter
set MYPYPATH=%MRSolution%\Tools\
:: Anaconda
call SetAnacondaPath

:: Active the ModelRelief Python environment.
call activate ./devenv
set PROMPT=(Development) $P$G
::call activate ./mrvenv
::set PROMPT=(Production) $P$G

:: Visual Studio 2017
call "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools\VsDevCmd.bat"


:: ASPNET CORE Configuration
set ASPNETCORE_ENVIRONMENT=Development
:: Ports Configuration
::  Command line (dotnet run) : ASPNETCORE_URLS environment variable
::  Visual Studio             : launchSettings.json
::  VSCode                    : launch.json
:: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?tabs=aspnetcore2x#useurls-limitations
set ASPNETCORE_URLS=https://localhost:%MRPortSecure%/;http://localhost:%MRPort%/
set ASPNETCORE_HTTPS_PORT=%MRPortSecure%

echo --- Environment ---
echo MR=%MR%
echo ASPNETCORE_URLS=%ASPNETCORE_URLS%
echo ASPNETCORE_HTTPS_PORT=%ASPNETCORE_HTTPS_PORT%
echo(
echo ASPNETCORE_ENVIRONMENT=%ASPNETCORE_ENVIRONMENT%
echo MRDatabaseProvider=%MRDatabaseProvider%
echo(
echo MRUpdateSeedData=%MRUpdateSeedData%
echo MRInitializeDatabase=%MRInitializeDatabase%
echo MRSeedDatabase=%MRSeedDatabase%
echo MRExitAfterInitialization=%MRExitAfterInitialization%
echo(

cd /D %MRSolution%
:end
