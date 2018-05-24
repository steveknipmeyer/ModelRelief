#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: workbench
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
# https://nikolak.com/pyqt-qt-designer-getting-started/

from PyQt5 import QtCore, QtGui, QtWidgets      # Import the PyQt4 module we'll need
import os
import sys                                      # We need sys so that we can pass argv to QApplication

import design # This file holds our MainWindow and all design related things
              # it also keeps events, etc that we defined in Qt Designer

class ExampleApp(QtWidgets.QMainWindow, design.Ui_MainWindow):
    def __init__(self):
        # Explaining super is out of the scope of this article
        # So please google it if you're not familar with it
        # Simple reason why we use it here is that it allows us to
        # access variables, methods etc in the design.py file
        super().__init__()
        self.setupUi(self)  # This is defined in design.py file automatically
                            # It sets up layout and widgets that are defined

        self.btnBrowse.clicked.connect(self.browse_folder)  # When the button is pressed
                                                            # Execute browse_folder function
    def browse_folder(self):
        self.listWidget.clear() # In case there are any existing elements in the list
        directory = QtWidgets.QFileDialog.getExistingDirectory(self,
                                                           "Pick a folder")
        # execute getExistingDirectory dialog and set the directory variable to be equal
        # to the user selected directory

        if directory: # if user didn't pick a directory don't continue
            for file_name in os.listdir(directory): # for all files, if any, in the directory
                self.listWidget.addItem(file_name)  # add file to the listWidget

def main():
    app = QtWidgets.QApplication(sys.argv)  # A new instance of QApplication
    form = ExampleApp()                 # We set the form to be our ExampleApp (design)
    form.show()                         # Show the form
    app.exec_()                         # and execute the app


if __name__ == '__main__':              # if we're running file directly and not importing it
    main()                              # run the main function
