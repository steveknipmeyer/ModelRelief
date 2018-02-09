echo off
title ModelRelief Shell

:: move up from Tools folder to solution root
cd %~dp0\..
set MRSolution=%cd%\
set MR=%MRSolution%ModelRelief\
echo MRsolution=%MRSolution%

:: ModelRelief runtime settings
:: N.B. These settings are used for XUnit and command line invocation (e.g. 'dotnet run')
:: These shell settings will always be <overridden> by these configuration provider in order:
::             Source                                                           Note
::             appsettings.json                                                 no MR settings
::             appsettings.<Environment>.json                                   no MR settings
::             Visual Studio launchSettings.json or VisualCode launch.json      not used by XUnit
:: Do not set MRInitializeUserStore if XUnit tests are being run from Visual Studio. The internal console cannot read the confirming Console.ReadLine.
set ASPNETCORE_ENVIRONMENT=Test
set MRDatabaseProvider=SQLServer
set MRInitializeDatabase=False
set MRInitializeUserStore=False

path=%path%;C:\Program Files\Git
path=%path%;%HOME%\Documents\Bin
path=%path%;%MRSolution%Tools
path=%path%;C:\Program Files (x86)\WinMerge
path=%path%;C:\Program Files\KDiff3

call "C:\Program Files\nodejs\nodevars.bat"

:: latest Python 3.X; Windows Python launcher (py.exe)
set PY_PYTHON=3

:: Visual Studio 2017
call "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools\VsDevCmd.bat"

:: TypeScript
echo TypeScript Version = 2.4
path=%path%;C:\Program Files (x86)\Microsoft SDKs\TypeScript\2.4

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
echo MRInitializeDatabase=%MRInitializeDatabase%
echo MRInitializeUserStore=%MRInitializeUserStore%
echo(

cd /D %MRSolution%
:end
