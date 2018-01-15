
:: Constructs the environment for Anaconda.
:: Based on "C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\cwp.py"

echo off
set ANACONDAPATH=C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64;C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\Library\mingw-w64\bin;C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\Library\usr\bin;C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\Library\bin;C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\Scripts;C:\Program Files (x86)\Microsoft Visual Studio\Shared\Anaconda3_64\Library\bin
set PATH=%ANACONDAPATH%;%PATH%

echo The shell path now includes the Anaconda environent.
