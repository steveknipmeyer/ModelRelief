echo off
title ModelRelief Shell

:: move up from Tools folder to solution root
echo %~dp0
cd/D %~dp0\..
set MRSolution=%cd%\
set MR=%MRSolution%ModelRelief\
set MRPublish=%MR%Publish\
echo MRSolution=%MRSolution%

:: ModelRelief Settings
:: Settings are <overridden> by these configuration providers in order:
::             Source                                                           Note
::             ------                                                           ----
::             environment variables                                            shell definitions
::             appsettings.json                                                 no MR settings
::             appsettings.<Environment>.json                                   no MR settings
::             Visual Studio Project launchSettings.json                        disable with --no-launch-profile, VSCode launch.json is <only> used when launching from VSCode
::             command line parameters                                          dotnet run -p ModelRelief --Variable=Value
:: https://blogs.msdn.microsoft.com/premier_developer/2018/04/15/order-of-precedence-when-configuring-asp-net-core/
:: The last key loaded wins.

:: N.B. These environment settings are the <only> settings used by XUnit (Visual Studio or 'dotnet test') 
::       because ModelRelief.Test does <not> have an appsettings.json or Properties/launchSettings.json.
set MRDatabaseProvider=SQLServer
set MRForceInitializeAll=False
set MRInitializeDatabase=False
set MRInitializeUserStore=False

path=%path%;%CD:~0,2%%HOMEPATH%\Documents\Bin
path=%path%;%MRSolution%Tools;;%MRSolution%Build
path=%path%;C:\Program Files\Git
path=%path%;C:\Program Files (x86)\WinMerge
path=%path%;C:\Program Files\KDeiff3

call "C:\Program Files\nodejs\nodevars.bat"

:: PYTHON
:: latest Python 3.X; Windows Python launcher (py.exe)
set PY_PYTHON=3
:: include Tools folder for general utility support
set PYTHONPATH=%PYTHONPATH%;%MRSolution%\Tools\;%MRSolution%Solver\
:: MyPy Linter
set MYPYPATH=%MRSolution%\Tools\
:: Anaconda
call SetAnacondaPath

:: Active the ModelRelied Python environment.
call activate ./devenv
::call activate ./mrvenv

:: Visual Studio 2017
call "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools\VsDevCmd.bat"

:: TypeScript
:: Target version must precede the path set by VsCevCmd. VSCode uses the command line to build TypeScript so the path is important.
echo TypeScript Version = 2.4
path=C:\Program Files (x86)\Microsoft SDKs\TypeScript\2.4;%path%

:: ASPNET CORE Configuration
set ASPNETCORE_ENVIRONMENT=Test
:: Ports Configuration
::  Command line (dotnet run) : ASPNETCORE_URLS environment variable    
::  Visual Studio             : launchSettings.json
::  VSCode                    : launch.json
:: https://stackoverflow.com/questions/46336341/configure-asp-net-core-2-0-kestrel-for-https
:: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?tabs=aspnetcore2x#useurls-limitations
:: set ASPNETCORE_URLS=https://*:60655
set ASPNETCORE_URLS=http://localhost:60655/

echo --- Environment ---
echo MR=%MR%
echo ASPNETCORE_URLS=%ASPNETCORE_URLS%
echo(
echo ASPNETCORE_ENVIRONMENT=%ASPNETCORE_ENVIRONMENT%
echo MRDatabaseProvider=%MRDatabaseProvider%
echo(
echo MRForceInitializeAll=%MRForceInitializeAll%
echo MRInitializeDatabase=%MRInitializeDatabase%
echo MRInitializeUserStore=%MRInitializeUserStore%
echo(

cd /D %MRSolution%
:end
