:: Compiles the QtDesigner XML form description to a Python source file.
echo off
python.exe -m PyQt5.uic.pyuic explorer.ui -o explorer_ui.py
