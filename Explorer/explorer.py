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
from meshtransform import ExperimentalParameter, MeshTransform
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
        """
        Initialize a float UI control.
        Parameters
        ----------
        field
            The QLineEdit control
        initial_value
            Initial value of the setting
        minimum
            Minimum value of the setting
        maximum
            Maximum value of the setting
        """
        field.setValidator(QtGui.QDoubleValidator(bottom=minimum, top=maximum, decimals=precision))
        field.setText(str(initial_value))

    def initialize_int_field(self, field: QtWidgets.QLineEdit, initial_value: int, minimum: int = 0, maximum: int = 100)-> None:
        """
        Initialize an integer UI control.
        Parameters
        ----------
        field
            The QLineEdit control
        initial_value
            Initial value of the setting
        minimum
            Minimum value of the setting
        maximum
            Maximum value of the setting
        """
        field.setValidator(QtGui.QIntValidator(bottom=minimum, top=maximum))
        field.setText(str(int(initial_value)))

    def initialize_experimental_parameter(self, parameter: ExperimentalParameter)-> None:
        """
        Initialize the UI controls for an ExperimentalParameter.
        Parameters
        ----------
        parameter
            The ExperimentalParameter backing the UI control.
        """
        # UI controls
        checkbox: QtWidgets.QCheckBox = getattr(self.ui, parameter.ui_checkbox)
        field: QtWidgets.QLineEdit = getattr(self.ui, parameter.ui_field)

        # checkbox
        if (not parameter.label):
            checkbox.setVisible(False)
        else:
            checkbox.setChecked(parameter.enabled)
            checkbox.setText(parameter.label)

        self.initialize_float_field(field, parameter.value)
        if parameter.ui_type is int:
            self.initialize_int_field(field, parameter.value)

        # bool types have no input field
        if parameter.ui_type is bool:
            field.setVisible(False)

    def initialize_ui_settings(self) ->None:
        # threshold
        self.ui.gradientThresholdCheckBox.setChecked(self.solver.mesh_transform.gradient_threshold_parameters.enabled)
        self.initialize_float_field(self.ui.gradientThresholdLineEdit, self.solver.mesh_transform.gradient_threshold_parameters.threshold)

        # attenuation
        self.ui.attenuationCheckBox.setChecked(self.solver.mesh_transform.attenuation_parameters.enabled)
        self.initialize_float_field(self.ui.attenuationFactorLineEdit,   self.solver.mesh_transform.attenuation_parameters.factor)
        self.initialize_float_field(self.ui.attenuationDecayLineEdit,    self.solver.mesh_transform.attenuation_parameters.decay)

        # unsharp masking
        self.ui.unsharpMaskingCheckBox.setChecked(self.solver.mesh_transform.unsharpmask_parameters.enabled)
        self.initialize_float_field(self.ui.unsharpGaussianLowLineEdit,  self.solver.mesh_transform.unsharpmask_parameters.gaussian_low)
        self.initialize_float_field(self.ui.unsharpGaussianHighLineEdit, self.solver.mesh_transform.unsharpmask_parameters.gaussian_high)
        self.initialize_float_field(self.ui.unsharpHFScaleLineEdit,      self.solver.mesh_transform.unsharpmask_parameters.high_frequency_scale)

        # geometry
        self.ui.planarBackgroundCheckBox.setChecked(self.solver.mesh_transform.planarBackground)
        self.ui.translateMeshZPositiveCheckBox.setChecked(self.solver.mesh_transform.translateMeshZPositive)

        # silhouettes
        self.ui.silhouetteCheckBox.setChecked(self.solver.mesh_transform.silhouette_parameters.enabled)
        self.initialize_float_field(self.ui.silhouetteSigmaLineEdit,  self.solver.mesh_transform.silhouette_parameters.sigma)
        self.initialize_int_field(self.ui.silhouettePassesLineEdit, self.solver.mesh_transform.silhouette_parameters.passes)

        # relief scale
        self.initialize_float_field(self.ui.reliefScaleLineEdit,  self.solver.mesh_transform.relief_scale)

        # experimental
        self.initialize_experimental_parameter(self.solver.mesh_transform.p1)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p2)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p3)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p4)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p5)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p6)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p7)
        self.initialize_experimental_parameter(self.solver.mesh_transform.p8)

    @benchmark()
    def initialize_ui(self)-> None:
        """
        Initialize the UI
        """
        self.ui:Ui_MainWindow = Ui_MainWindow()
        self.ui.setupUi(self)

        self.initialize_ui_settings()

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
        self.update_ui()

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
        self.update_ui()

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

    def update_solver_settings(self) ->None:
        """
        Updates the Solver settings <not persisted in the JSON settings file>.
        """
        # file output
        self.solver.enable_obj = self.ui.fileOBJCheckBox.isChecked()

    def handle_process(self, clear_content: bool = False, preserve_camera: bool = True) -> None:
        """
        Event handlers for Process button.
        Updates settings, calculates the new mesh and updates the UI.
        Parameters
        ----------
        clear_content
            Clear any existing tab content
        preserve_camera
            Preserve camera settings for a view to maintain continuity across parameter changes.
        """
        # write the modified JSON mesh file
        self.solver.mesh_transform.update_settings()
        # with open(self.settings_file, 'w') as json_file:
        #     json.dump(self.solver.settings, json_file, indent=4)

        self.solver.initialize(self.settings_file)
        self.update_solver_settings()

        self.calculate()
        self.update_ui(clear_content, preserve_camera)

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

            self.solver.initialize(self.settings_file)
            self.initialize_ui_settings()

            self.handle_process(clear_content = True, preserve_camera=False)

    def calculate(self) -> None:
        """
        Transfor the active model using the MeshTransform.
        """
        self.set_busy (True)

        # solve
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

    def update_ui(self, clear_content: bool = False, preserve_camera: bool = True) -> None:
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
