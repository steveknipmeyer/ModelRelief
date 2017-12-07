echo off
title ModelRelief Shell

set MRRoot="D:\Users\Steve Knipmeyer\Documents\GitHub\ModelRelief\"
set MR=%MRRoot%ModelRelief\

path=%path%;"D:\Users\Steve Knipmeyer\Documents\Bin"
path=%path%;%MR%tools
path=%path%;C:\Program Files (x86)\WinMerge
path=%path%;C:\Program Files\KDiff3

call "C:\Program Files\nodejs\nodevars.bat"

:: Python 2.7 Deprecated; Anaconda is now the default installation.
:: path=%path%;C:\Python27\Tools\
:: set PythonPath=C:\Python27\Tools\Lib\

echo on
:: Visual Studio 2017
call "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC\Auxiliary\Build\vcvarsall.bat" x64

:: TypeScript
echo TypeScript Version = 2.4
path=%path%;C:\Program Files (x86)\Microsoft SDKs\TypeScript\2.4

:: Ports Configuration
::  Command line (dotnet run) : ASPNETCORE_URLS environment variable    
::  Visual Studio             : launchSettings.json
::  VSCode                    : launch.json
set ASPNETCORE_URLS=https://*:60655

cd /D %MRRoot%
::start code
cd /D %MR%
