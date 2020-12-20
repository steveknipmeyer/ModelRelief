G# Compiles the QtDesigner XML form description to a Python source file.
echo Compiling QtDesigner layout to Python
python -m PyQt5.uic.pyuic Explorer/explorer.ui -o Explorer/explorer_ui.py

echo Compiling QtDesigner resource definitions to Python
pyrcc5 Explorer/explorer.qrc -o Explorer/explorer_rc.py
