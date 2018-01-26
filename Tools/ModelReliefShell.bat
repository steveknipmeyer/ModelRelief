echo off
title ModelRelief Shell

:: move up from Tools folder to solution root
cd %~dp0\..
set MRSolution=%cd%\
set MR=%MRSolution%ModelRelief\
echo MRsolution=%MRSolution%

:: ModelRelief runtime settings
:: N.B. These settings are used for command line invocation (e.g. 'dotnet run')
:: The Visual Studio launchSettings.json or VisualCode launch.json will always <override> these settings.
:: Do not set InitializeUserStore if XUnit tests are being run from Visual Studio. 
set ASPNETCORE_ENVIRONMENT=Test
set ModelReliefDatabase=SQLServer
set InitializeDatabase=False
set InitializeUserStore=False

path=%path%;D:\Users\Steve Knipmeyer\Documents\Bin
path=%path%;%MRSolution%Tools
path=%path%;C:\Program Files (x86)\WinMerge
path=%path%;C:\Program Files\KDiff3

call "C:\Program Files\nodejs\nodevars.bat"

:: Python
:: Python 2.7 deprecated; Anaconda is now the default installation.
:: path=%path%;C:\Python27\Tools\
:: set PythonPath=C:\Python27\Tools\Lib\

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
echo ModelReliefDatabase=%ModelReliefDatabase%
echo InitializeDatabase=%InitializeDatabase%
echo InitializeUserStore=%InitializeUserStore%
echo(

cd /D %MRSolution%
:end
