:: Compiles the QtDesigner XML form description to a Python source file.
echo off
python.exe -m PyQt5.uic.pyuic Solver/explorer.ui -o Solver/explorer_ui.py
pyrcc5 Solver/explorer.qrc -o Solver/explorer_rc.py
