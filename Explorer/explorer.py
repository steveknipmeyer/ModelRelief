    #!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: explorer
   :synopsis: Experiments in relief processing.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import argparse
import json
import os
import qdarkstyle

from PyQt5 import QtGui, QtCore, QtWidgets
from typing import Any, Callable, Dict, Optional, Tuple

from explorer_ui import Ui_MainWindow
from results import Results, DataSource
from solver import Solver
from stopwatch import benchmark, StopWatch
from widgets import ImageTab, ImageType, MeshTab, MeshType

class Explorer(QtWidgets.QMainWindow):

    def __init__(self, settings_file: str, working: str, qapp : QtWidgets.QApplication) -> None:
        """Perform class initialization.
        Parameters
        ----------
        settings_file
            The path to the JSON Mesh settings file.
        working
            The working folder to be used for intermediate results.
        """
        super().__init__()

        self.debug = True

        self.settings_file = ''
        self.settings = self.load_settings(settings_file)
        self.working = working

        # solver instance
        self.solver = Solver(self.settings_file, self.working)

        self.qapp = qapp
        self.resize_timer: Optional[QtCore.QTimer] = None

        # initialize UI
        self.image_tabs: Dict[ImageType, ImageTab] = {}
        self.mesh_tabs: Dict[MeshType, MeshTab] = {}
        self.initialize_ui()

        # event handlers
        self.initialize_handlers()

    # ------------------------------------------#
    #             Initialization                #
    # ------------------------------------------#

    def load_settings(self, settings_file: str)->Dict[str, Any]:
        """
        Loads the JSON mesh settings file.
        Parameters
        ----------
        settings_file
            The absolute path of the settings file.
        """
        self.settings_file = settings_file
        with open(self.settings_file) as json_file:
            settings = json.load(json_file)
        return settings

    def construct_tabs(self) -> None:
        """
        Construct the result tabs with the images, meshes, etc. from the calculated solution.
        """
        # image views
        self.image_tabs[ImageType.DepthBuffer]      = ImageTab(self.ui.depthBufferTab, ImageType.DepthBuffer, "gray", ImageTab.add_image, DataSource(self.solver.results, "depth_buffer_model"))
        self.image_tabs[ImageType.Relief]           = ImageTab(self.ui.reliefTab, ImageType.Relief, "gray", ImageTab.add_image, DataSource(self.solver.results, "mesh_transformed"))
        self.image_tabs[ImageType.BackgroundMask]   = ImageTab(self.ui.backgroundMaskTab, ImageType.BackgroundMask, "gray", ImageTab.add_image, DataSource(self.solver.results, "depth_buffer_mask"))
        self.image_tabs[ImageType.GradientX]        = ImageTab(self.ui.gradientXTab, ImageType.GradientX, "Blues_r", ImageTab.add_image, DataSource(self.solver.results, "gradient_x"))
        self.image_tabs[ImageType.GradientXMask]    = ImageTab(self.ui.gradientXMaskTab, ImageType.GradientXMask, "gray", ImageTab.add_image, DataSource(self.solver.results, "gradient_x_mask"))
        self.image_tabs[ImageType.GradientY]        = ImageTab(self.ui.gradientYTab, ImageType.GradientY, "Blues_r", ImageTab.add_image, DataSource(self.solver.results, "gradient_y"))
        self.image_tabs[ImageType.GradientYMask]    = ImageTab(self.ui.gradientYMaskTab, ImageType.GradientYMask, "gray", ImageTab.add_image, DataSource(self.solver.results, "gradient_y_mask"))
        self.image_tabs[ImageType.CompositeMask]    = ImageTab(self.ui.compositeMaskTab, ImageType.CompositeMask, "gray", ImageTab.add_image, DataSource(self.solver.results, "combined_mask"))
        self.image_tabs[ImageType.GradientXUnsharp] = ImageTab(self.ui.gradientXUnsharpTab, ImageType.GradientXUnsharp, "Blues_r", ImageTab.add_image, DataSource(self.solver.results, "gradient_x_unsharp"))
        self.image_tabs[ImageType.GradientYUnsharp] = ImageTab(self.ui.gradientYUnsharpTab, ImageType.GradientYUnsharp, "Blues_r", ImageTab.add_image, DataSource(self.solver.results, "gradient_y_unsharp"))

        # mesh views
        self.mesh_tabs[MeshType.Model]  = MeshTab(self.ui.modelMeshTab,  MeshType.Model,  "Model", "Blues_r", DataSource(self.solver.results, "depth_buffer_model"))
        self.mesh_tabs[MeshType.ModelScaled]  = MeshTab(self.ui.modelMeshScaledTab,   MeshType.ModelScaled,  "Model Scaled", "Blues_r", DataSource(self.solver.results, "mesh_scaled"))
        self.mesh_tabs[MeshType.Relief] = MeshTab(self.ui.reliefMeshTab, MeshType.Relief, "Relief", "Blues_r", DataSource(self.solver.results, "mesh_transformed"))

        # workbench image views
        self.image_tabs[ImageType.Image1] = ImageTab(self.ui.i1Tab, ImageType.Image1, "gray", ImageTab.add_image, DataSource(self.solver.results, "i1"))
        self.image_tabs[ImageType.Image2] = ImageTab(self.ui.i2Tab, ImageType.Image2, "gray", ImageTab.add_image, DataSource(self.solver.results, "i2"))
        self.image_tabs[ImageType.Image3] = ImageTab(self.ui.i3Tab, ImageType.Image3, "gray", ImageTab.add_image, DataSource(self.solver.results, "i3"))
        self.image_tabs[ImageType.Image4] = ImageTab(self.ui.i4Tab, ImageType.Image4, "gray", ImageTab.add_image, DataSource(self.solver.results, "i4"))
        self.image_tabs[ImageType.Image5] = ImageTab(self.ui.i5Tab, ImageType.Image5, "gray", ImageTab.add_image, DataSource(self.solver.results, "i5"))
        self.image_tabs[ImageType.Image6] = ImageTab(self.ui.i6Tab, ImageType.Image6, "gray", ImageTab.add_image, DataSource(self.solver.results, "i6"))
        self.image_tabs[ImageType.Image7] = ImageTab(self.ui.i7Tab, ImageType.Image6, "gray", ImageTab.add_image, DataSource(self.solver.results, "i7"))
        self.image_tabs[ImageType.Image8] = ImageTab(self.ui.i8Tab, ImageType.Image6, "gray", ImageTab.add_image, DataSource(self.solver.results, "i8"))

    def initialize_float_field(self, field: QtWidgets.QLineEdit, initial_value: float, minimum: float = 0.0, maximum: float = 100.0, precision: int = 2)-> None:
        field.setText(str(initial_value))
        field.setValidator(QtGui.QDoubleValidator(minimum, maximum, precision))

    def initialize_settings(self) ->None:
        mesh_transform:Dict[str, float] = self.settings['MeshTransform']

        self.initialize_float_field(self.ui.gradientThresholdLineEdit,   mesh_transform['GradientThreshold'])
        self.initialize_float_field(self.ui.attenuationFactorLineEdit,   mesh_transform['AttenuationFactor'])
        self.initialize_float_field(self.ui.attenuationDecayLineEdit,    mesh_transform['AttenuationDecay'])
        self.initialize_float_field(self.ui.unsharpGaussianLowLineEdit,  mesh_transform['UnsharpGaussianLow'])
        self.initialize_float_field(self.ui.unsharpGaussianHighLineEdit, mesh_transform['UnsharpGaussianHigh'])
        self.initialize_float_field(self.ui.unsharpHFScaleLineEdit,      mesh_transform['UnsharpHighFrequencyScale'])

        self.initialize_float_field(self.ui.p1LineEdit, mesh_transform['P1'])
        self.initialize_float_field(self.ui.p2LineEdit, mesh_transform['P2'])
        self.initialize_float_field(self.ui.p3LineEdit, mesh_transform['P3'])
        self.initialize_float_field(self.ui.p4LineEdit, mesh_transform['P4'])
        self.initialize_float_field(self.ui.p5LineEdit, mesh_transform['P5'])
        self.initialize_float_field(self.ui.p6LineEdit, mesh_transform['P6'])
        self.initialize_float_field(self.ui.p7LineEdit, mesh_transform['P7'])
        self.initialize_float_field(self.ui.p8LineEdit, mesh_transform['P8'])

        self.ui.p8LineEdit.setValidator(QtGui.QDoubleValidator(0.0, 1.0, 2))

        checkbox_enabled = True
        self.ui.gradientThresholdCheckBox.setChecked(checkbox_enabled)
        self.ui.attenuationCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpMaskingCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpGaussianLowCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpGaussianHighCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpHFScaleCheckBox.setChecked(checkbox_enabled)

        # definitions in Solver.py
        self.ui.p1CheckBox.setChecked(True)
        self.ui.p2CheckBox.setChecked(False)
        self.ui.p3CheckBox.setChecked(False)
        self.ui.p4CheckBox.setChecked(False)
        self.ui.p5CheckBox.setChecked(False)
        self.ui.p6CheckBox.setChecked(False)
        self.ui.p7CheckBox.setChecked(False)
        self.ui.p8CheckBox.setChecked(False)

    @benchmark()
    def initialize_ui(self)-> None:
        """
        Initialize the UI
        """
        self.ui:Ui_MainWindow = Ui_MainWindow()
        self.ui.setupUi(self)

        self.initialize_settings()

        # solve
        self.calculate()

        self.construct_tabs()

        # N.B. First update of tabs will be performed following the system-generate resizeEvent.

    # ------------------------------------------#
    #               Event Handlers              #
    # ------------------------------------------#
    def resize_ui(self)-> None:
        """ Handles a resize event for the main window. """

        self.set_busy (True)

        self.invalidate()
        self.update()

        self.set_busy (False)

    def resizeEvent(self, event: QtGui.QResizeEvent):
        """ Event handler for window resize.
            http://www.qtcentre.org/archive/index.php/t-10000.html
            https://stackoverflow.com/questions/46656634/pyqt5-qtimer-count-until-specific-seconds
        Parameters
        ----------
        event
            The PyQt5.QtGui.QResizeEvent
        """
        def handler():
            self.resize_ui()
            self.resize_timer.stop()

        # kill existing timer
        if self.resize_timer is not None:
            self.resize_timer.stop()

        # start new timer
        self.resize_timer = QtCore.QTimer()
        self.resize_timer.timeout.connect(handler)
        self.resize_timer.start(100)

        return super().resizeEvent(event)

    def tab_selected(self)-> None:
        """
        Event handler for a tab selected event.
        """
        self.update()

    def initialize_handlers(self)-> None:
        """ Initialize event handlers """
        self.ui.imageTabs.currentChanged.connect(self.tab_selected)
        self.ui.workbenchTabs.currentChanged.connect(self.tab_selected)
        self.ui.modelTabs.currentChanged.connect(self.tab_selected)
        self.ui.overallTabsContainer.currentChanged.connect(self.tab_selected)

        self.ui.processButton.clicked.connect(self.handle_process)
        self.ui.actionOpen.triggered.connect(self.handle_open_settings)

    def set_busy(self, enable: bool)-> None:
        """
        Controls the UI busy indicator.
        Parameters
        ----------
        enable
            On/Off
        """
        self.ui.labelProcessing.setVisible(enable)
        self.ui.labelProcessing.repaint()

    def handle_process(self) ->None:
        """
        Recalculates the views.
        """
        mesh_transform:Dict[str, float] = self.settings['MeshTransform']

        # threshold
        mesh_transform['GradientThreshold'] = float(self.ui.gradientThresholdLineEdit.text())

        # attenuation
        mesh_transform['AttenuationFactor'] = float(self.ui.attenuationFactorLineEdit.text())
        mesh_transform['AttenuationDecay']  = float(self.ui.attenuationDecayLineEdit.text())

        # unsharp masking
        mesh_transform['UnsharpGaussianLow'] = float(self.ui.unsharpGaussianLowLineEdit.text())
        mesh_transform['UnsharpGaussianHigh'] = float(self.ui.unsharpGaussianHighLineEdit.text())
        mesh_transform['UnsharpHighFrequencyScale'] = float(self.ui.unsharpHFScaleLineEdit.text())

        # experimental
        mesh_transform['P1'] = float(self.ui.p1LineEdit.text())
        mesh_transform['P2'] = float(self.ui.p2LineEdit.text())
        mesh_transform['P3'] = float(self.ui.p3LineEdit.text())
        mesh_transform['P4'] = float(self.ui.p4LineEdit.text())
        mesh_transform['P5'] = float(self.ui.p5LineEdit.text())
        mesh_transform['P6'] = float(self.ui.p6LineEdit.text())
        mesh_transform['P7'] = float(self.ui.p7LineEdit.text())
        mesh_transform['P8'] = float(self.ui.p8LineEdit.text())

        # write the modified JSON mesh file
        with open(self.settings_file, 'w') as json_file:
            json.dump(self.settings, json_file, indent=4)

        self.calculate()
        self.update(preserve_camera=True)

    def handle_open_settings(self) ->None:
        """
        Opens a new settings file.
        """
        dialog = QtWidgets.QFileDialog()
        dialog.setFileMode(QtWidgets.QFileDialog.AnyFile)
        dialog.setNameFilter("All JSON files (*.json)")
        dialog.setDirectory(os.path.abspath(os.path.join(self.working, os.pardir)))

        if dialog.exec_():
            filenames = dialog.selectedFiles()
            self.settings = self.load_settings(filenames[0])

            self.initialize_settings()
            self.calculate()
            self.update(clear_content = True, preserve_camera=False)

    def calculate(self) -> None:
        """
        Transfor the active model using the MeshTransform.
        """
        self.set_busy (True)

        #enable processing steps
        self.solver.enable_gradient_threshold = self.ui.gradientThresholdCheckBox.isChecked()
        self.solver.enable_attenuation = self.ui.attenuationCheckBox.isChecked()
        self.solver.enable_unsharpmask = self.ui.unsharpMaskingCheckBox.isChecked()
        self.solver.enable_unsharpmask_gaussian_high = self.ui.unsharpGaussianLowCheckBox.isChecked()
        self.solver.enable_unsharpmask_gaussian_low = self.ui.unsharpGaussianHighCheckBox.isChecked()
        self.solver.enable_unsharpmask_high_frequence_scale = self.ui.unsharpHFScaleCheckBox.isChecked()

        # experimental
        self.solver.enable_p1 = self.ui.p1CheckBox.isChecked()
        self.solver.enable_p2 = self.ui.p2CheckBox.isChecked()
        self.solver.enable_p3 = self.ui.p3CheckBox.isChecked()
        self.solver.enable_p4 = self.ui.p4CheckBox.isChecked()
        self.solver.enable_p5 = self.ui.p5CheckBox.isChecked()
        self.solver.enable_p6 = self.ui.p6CheckBox.isChecked()
        self.solver.enable_p7 = self.ui.p7CheckBox.isChecked()
        self.solver.enable_p8 = self.ui.p8CheckBox.isChecked()

        # file output
        self.solver.enable_obj = self.ui.fileOBJCheckBox.isChecked()

        # solve
        self.solver.initialize(self.settings_file)
        self.solver.transform()
        self.invalidate()

        self.set_busy (False)

    # ------------------------------------------#
    #                 Update                    #
    # ------------------------------------------#
    def invalidate(self)->None:
        """
        Invalidates all content.
        This is triggered when the Solver results have changed or a resizeEvent makes it necessary to re-construct a content tab.
        """
        # images
        for _, image_tab in self.image_tabs.items():
            image_tab.source.dirty = True

        #meshes
        for _, mesh_tab in self.mesh_tabs.items():
            mesh_tab.source.dirty = True

    def update_image_tabs(self, clear_content: bool = False, )-> None:
        """
        Updates the tabs holding pure images.
        """
        for _, tab in self.image_tabs.items():
            if clear_content:
                tab.figure = None
            if tab.widget.isVisible():
                tab.update()

    def update_mesh_tabs(self, preserve_camera: bool = True)-> None:
        """
        Updates the tabs holding 3D meshes.
        """
        for _, tab in self.mesh_tabs.items():
            tab.mesh_widget.mesh_content.update(preserve_camera)

    def update(self, clear_content: bool = False, preserve_camera: bool = True) -> None:
        """ Update the UI with the images, meshes, etc. from the calculated solution.
        Parameters
        ----------
        clear_content
            Clear any existing tab content
        preserve_camera
            Preserve camera settings for a view to maintain continuity across parameter changes.
        """
        self.set_busy (True)

        self.update_image_tabs(clear_content)
        self.update_mesh_tabs(preserve_camera)

        self.set_busy (False)


def main():
    """
    Main entry point.
    """
    # This hook is used to allow an external debugger to be attached.
    # input("Attach debugger and press <Enter>:")

    os.chdir(os.path.dirname(__file__))

    options_parser = argparse.ArgumentParser()
    options_parser.add_argument('--settings', '-s',
                                help='Mesh JSON settings file that defines the associated DepthBuffer and MeshTransform.', required=True)
    options_parser.add_argument('--working', '-w',
                                help='Temporary working folder.', required=True)
    arguments = options_parser.parse_args()

    qapp = QtWidgets.QApplication([])
    qapp.setStyleSheet(qdarkstyle.load_stylesheet_pyqt5())

    StopWatch.silent = True
    explorer = Explorer(arguments.settings, arguments.working, qapp)

    # self.explorer.showMinimized()
    # self.explorer.showNormal()
    # self.explorer.showMaximized()

    explorer.show()

    exit(qapp.exec_())

if __name__ == '__main__':
    main()
