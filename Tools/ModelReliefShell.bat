echo off
title ModelRelief Shell

:: move up from batch file directory to solution root
cd %~dp0\..\..
set MRSolution=%cd%\
set MR=%MRSolution%ModelRelief\
echo MRsolution=%MRSolution%

:: ModelRelief runtime settings
set ModelReliefDatabase=SQLServer
set InitializeDatabase=False
set InitializeUserStore=False

echo MR=%MR%
echo ModelReliefDatabase=%ModelReliefDatabase%
echo InitializeDatabase=%InitializeDatabase%
echo InitializeUserStore=%InitializeUserStore%
echo

path=%path%;"D:\Users\Steve Knipmeyer\Documents\Bin"
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
set ASPNETCORE_URLS=https://*:60655

cd /D %MR%
:end
