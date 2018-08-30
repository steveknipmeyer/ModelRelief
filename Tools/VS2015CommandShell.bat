echo off
title Visual Studio 2015 Shell

path=%path%;%CD:~0,2%%HOMEPATH%\Documents\Bin
path=%path%;C:\Program Files\Git
path=%path%;C:\Program Files (x86)\WinMerge
path=%path%;C:\Program Files\KDiff3

:: PYTHON
:: latest Python 3.X; Windows Python launcher (py.exe)
set PY_PYTHON=3

:: Visual Studio 2015
call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat"

:end
