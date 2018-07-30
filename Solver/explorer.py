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
import json
import os
# First, and before importing any Enthought packages, set the ETS_TOOLKIT environment variable to qt4 to tell Traits that we will use Qt.
os.environ['ETS_TOOLKIT'] = 'qt4'
# By default, mayavi uses the PySide bindings. For the PyQt bindings, set the QT_API environment variable to 'pyqt5'
os.environ['QT_API'] = 'pyqt5'

# To be able to use PySide or PyQt4 and not run in conflicts with traits, we need to import QtGui and QtCore from pyface.qt
from PyQt5 import QtGui, QtCore, QtWidgets

import matplotlib
matplotlib.use('Qt5Agg')
import matplotlib.pyplot as plt

from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT as NavigationToolbar
from matplotlib.figure import Figure
from matplotlib.transforms import Bbox
from mpl_toolkits.mplot3d import Axes3D

from traits.api import HasTraits, Instance, on_trait_change
from traitsui.api import View, Item
from mayavi.core.ui.api import MayaviScene, MlabSceneModel, SceneEditor
from mayavi import mlab

import numpy as np
from numpy import pi, sin, cos, mgrid
from enum import Enum
from typing import Any, Callable, Dict, Optional

from results import Results
from solver import Solver
from stopwatch import benchmark

import explorer_ui

class ImageType(Enum):
    """
    A class representing the various UI image view types.
    """
    DepthBuffer = 1,
    Relief = 2,
    BackgroundMask = 3,
    GradientX = 4,
    GradientXMask = 5,
    GradientY = 6,
    GradientYMask = 7,
    CompositeMask = 8,
    GradientXUnsharp = 9,
    GradientYUnsharp = 10,

    # workbench
    Image1 = 11,
    Image2 = 12,
    Image3 = 13,
    Image4 = 14,
    Image5 = 15,
    Image6 = 16,

class Camera:
    """
    A class representing the Mayavi scene camera.
    """
    def __init__(self, figure) ->None:
        """
        Initialization
        """
        self.figure = figure

        self.azimuth, self.elevation, self.distance, self.focalpoint = mlab.view(figure=self.figure) 
        self.roll = mlab.roll(figure=self.figure)

    def apply (self, figure=None) -> None:
        """
        Apply the camera settings to the given figure.
        """
        figure = self.figure if figure is None else figure
        mlab.view(azimuth=self.azimuth, elevation=self.elevation, distance=self.distance, focalpoint=self.focalpoint, roll=self.roll, figure=figure)

class MeshType(Enum):
    """
    A class representing the various UI mesh view types.
    """
    Model  = 1,
    ModelScaled  = 2,    
    Relief = 3

class ImageTab():
    """ A UI tab of an image view. """

    def __init__(self, widget: QtWidgets.QWidget, image_type: ImageType, title: str, cmap: str, content_ctor: Callable[[Figure, plt.Axes, np.ndarray, str, str], Figure], data: np.ndarray,  ) -> None:
        """ A UI image tab in the Explorer.
        Parameters
        ----------
        widget
            QWidget of the tab.
        image_type
            The type of the image.
        title
            The title of the view.
        cmap
            The matplotlib colormap.
        content_ctor
            The content constructor function that populates the given figure.
        data
            The Numpy array holding the image data.
        """
        self.widget = widget
        self.image_type = image_type
        self.title = title
        self.cmap = cmap

        self.figure: Figure = None
        self.canvas: FigureCanvas = None
        self.scroll: QtWidgets.QScrollArea = None
        self.nav: NavigationToolbar = None

        self.content_ctor = content_ctor
        self._data = None
        self.data = data

    @property
    def data(self) -> np.ndarray:
        """ Returns the Numpy data array. """
        return self._data

    @data.setter
    def data (self, value: np.ndarray):
        """ Sets the NumPy data array.
        """
        self._data = value
        self.construct_tab() 

    def get_view_extents(self, figure: Figure)->Bbox:
        """ Returns the bounding box extents of a figure
        Parameters
        ---------
        figure
            The Figure to query.
        """
        # N.B. get_axes() returns a List; axes[0] = data axes; axes[1] = normalized axes?
        axes = figure.get_axes()[0]
        return axes.viewLim

    def set_view_extents(self, figure: Figure, limits: Bbox)->Bbox:
        """ Sets the bounding box extents of a figure
        Parameters
        ---------
        figure
            The Figure to update.
        limits
            The new bounding box.
        """
        axes = figure.get_axes()[0]
        # points: a 2x2 numpy array of the form [[x0, y0], [x1, y1]]
        points = limits.get_points()
        axes.set_xlim(points[0][0], points[1][0])
        axes.set_ylim(points[0][1], points[1][1])

    def construct_tab (self):
        """ Constructs the UI tab with the image content.
            Regenerates the matplotlib Figure.
        """
        if self.widget.objectName() == 'i1Tab':
            print ("i1Tab construct")
            
        figure_exists = self.figure != None
        if figure_exists:
            viewLim = self.get_view_extents(self.figure)
            plt.close(self.figure)

        # construct image figure
        self.figure = self.construct_subplot_figures ([self._data], 1, [self.title], [self.cmap])

        # restore extents
        if figure_exists:
            self.set_view_extents(self.figure, viewLim)

        self.canvas = FigureCanvas(self.figure)
        self.canvas.draw()

        # navigation toolbar
        if (self.nav is None):
            self.nav = NavigationToolbar(self.canvas, self.widget)
            self.widget.layout().addWidget(self.nav)

        # scroll area
        if (self.scroll is None):
            self.scroll = QtWidgets.QScrollArea(self.canvas)
            self.widget.layout().addWidget(self.scroll)

        # update associated controls
        self.scroll.setWidget(self.canvas)
        self.nav.canvas = self.canvas

        # self.widget.adjustSize()
        # self.widget.repaint()
        # self.widget.update()

    @staticmethod
    def add_image(figure: Figure, subplot: plt.Axes, image: np.ndarray, title: str, cmap: str) -> plt.Figure:
        """ Adds an image to the given Figure.
        Parameters
        ---------
        figure
            The Figure to which the image will be added.
        subplot
            The subplot Axes of the Figure.
        image
            The image array.
        title
            The title of the image Figure.
        cmap
            The colormap to be used.
        Returns
        -------
        A Figure.
        """
        # flip; first row is at minimum Y
        image = np.flipud(image)

        plot = plt.imshow(image, cmap)

        # title
        title_obj = subplot.set_title(title)
        plt.setp(title_obj, color='w')                         # set the color of title to white

        # axes
        plt.setp(plt.getp(subplot, 'yticklabels'), color='w') # set yticklabels color
        plt.setp(plt.getp(subplot, 'xticklabels'), color='w') # set xticklabels color

        # colorbar
        # https://matplotlib.org/examples/images_contours_and_fields/pcolormesh_levels.html
        colorbar = figure.colorbar(plot, ax=subplot, drawedges=True)
        plt.setp(plt.getp(colorbar.ax.axes, 'yticklabels'), color='w')  # set colorbar to match Y labels
                                                                        # yticklabels color
        colorbar.outline.set_edgecolor('w')                             # set colorbar box color
        colorbar.outline.set_linewidth(2)
        colorbar.ax.yaxis.set_tick_params(color='w')                    # set colorbar ticks color
        colorbar.dividers.set_linewidth(0)

        return figure

    def size_figure(self, figure: Figure, n_subplots: int) -> None:
        """
        Sizes a figure to fit the aspect ratio and dimensions of the parent tab.
        Parameters
        ----------
        figure
            The Figure to resize.
        n_subplots
            Number of subplots.
        """
        xdpi = self.widget.logicalDpiX()
        ydpi = self.widget.logicalDpiY()
        dpi = max(xdpi, ydpi)

        widget_height = self.widget.parent().height() / dpi
        widget_width  = self.widget.parent().width() / dpi
        widget_aspect_ratio = widget_height / widget_width

        baseline_height, baseline_width = figure.get_size_inches()
        # add height of navigation bar
        if self.nav is not None:
            nav_height = self.nav.height() / dpi
            baseline_height += nav_height

        figure_aspect_ratio = baseline_height / baseline_width

        # widget is "flatter" than figure
        widget_aspect_ratio_smaller = widget_aspect_ratio < figure_aspect_ratio

        display_height = widget_height if widget_aspect_ratio_smaller else widget_width * figure_aspect_ratio
        display_width  = display_height / figure_aspect_ratio

        # if (self.widget.objectName() == "depthBufferTab"):
            # print (f"Widget: AR = {widget_aspect_ratio}, height = {widget_height}, width = {widget_width}")
            # print (f"Figure: AR = {figure_aspect_ratio}, height = {baseline_height}, width = {baseline_width}")
            # print (f"Display: height = {display_height}, width = {display_width}")
            # print ()

        figure.set_size_inches(n_subplots * display_width, display_height)
        try:
            figure.tight_layout()
        except ValueError:
            pass

    def construct_subplot_figures(self, data, rows, titles = None, cmaps = None) -> plt.Figure:
        """Display a list of subplots in a single figure with matplotlib.
        https://gist.github.com/soply/f3eec2e79c165e39c9d540e916142ae1
        https://stackoverflow.com/questions/9662995/matplotlib-change-title-and-colorbar-text-and-tick-colors

        Parameters
        ---------
        data
            List of np.arrays holding the data.
        rows (Default = 1)
            Number of rows in figure (number of columns is set to np.ceil(n_subplots/float(rows))).
        titles
            List of titles corresponding to each subplot. Must have the same length as data.
        cmaps
            List of color maps corresponding to each figure. Must have the same length as data.
        Returns
        -------
        A Figure.
        """
        assert((titles is None) or (len(data) == len(titles)))
        n_subplots = len(data)
        if titles is None: titles = ['Figure (%d)' % i for i in range(1, n_subplots + 1)]

        figure = plt.figure(facecolor='black')

        columns = np.ceil(n_subplots/float(rows))
        for n, (data_array, title, cmap) in enumerate(zip(data, titles, cmaps)):
            # make a subplot active
            subplot = figure.add_subplot(rows, columns, n + 1)

            figure = self.content_ctor(figure, subplot, data_array, title, cmap)

        self.size_figure(figure, n_subplots)

        return figure

class MeshTab():
    """ A UI tab of a mesh view. """

    def __init__(self, widget: QtWidgets.QWidget, mesh_type: MeshType, title: str, cmap: str, data: np.ndarray,  ) -> None:
        """ A UI mesh tab in the Explorer.
        Parameters
        ----------
        widget
            QWidget of the tab.
        mesh_type
            The type of the mesh.
        title
            The title of the view.
        cmap
            The matplotlib colormap.
        data
            The Numpy array holding the mesh data.
        """
        self.widget = widget
        self.mesh_type = mesh_type
        self.title = title
        self.cmap = cmap

        self.mesh_widget = MeshContainer(data, self.mesh_type)
        self.widget.layout().addWidget(self.mesh_widget)

class MeshContent(HasTraits):
    """ Holds an instance of a 3D Mesh """

    def __init__ (self, data: np.ndarray, mesh_type: MeshType) -> None:
        """ Initialization.
        Parameters
        ----------
        data
            The Numpy array holding the data.
        mesh_type
            The type of the mesh.
        """
        super().__init__()

        self._data = data
        self.mesh_type = mesh_type
        self.camera: Optional[Camera] = None

    @property
    def data(self) -> np.ndarray:
        """ Returns the backing Numpy ndarray. """
        return self._data

    @data.setter
    def data (self, value: np.ndarray):
        """ Sets the NumPy data array."""
        self._data = value

    def set_mesh(self, mesh: np.ndarray, preserve_camera:bool = True):
        """ Sets the active mesh."""
        self.data = mesh
        self.update_content()

        if preserve_camera and self.camera is not None:
            self.camera.apply()

    def update(self, scene):
        # This function is called when the view is opened. We don't populate the scene
        # when the view is not yet open, as some VTK features require a GLContext.

        shape = self.data.shape
        width = shape[1]
        height = shape[0]
        X = np.arange(0, width, 1.0)
        Y = np.arange(0, height, 1.0)

        X, Y = np.meshgrid(X, Y)
        Z = self.data

        colors = np.empty(X.shape, dtype=str)
        colors.fill('b')

        # figure for this MeshContent
        current_figure = scene.mayavi_scene

        # get active camera
        self.camera = Camera(figure=current_figure)

        # clear figure
        mlab.clf(figure=current_figure)
        mlab.figure(figure=current_figure, bgcolor=(0, 0, 0))

        # create new figure
        cyan = (0.25, 0.95, 0.92)
        mlab.mesh(X, Y, Z, figure=current_figure, color=cyan)
        #mlab.surf(Z, figure=current_figure, warp_scale="auto")

class ModelMeshContent(MeshContent, HasTraits):
    """ Holds an instance of a Model Mesh """

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), show_label=False),
                     resizable=True # We need this to resize with the parent widget
                     )

    @on_trait_change('scene.activated')
    def update_content(self):
        super().update(self.scene)

class ModelMeshScaledContent(MeshContent, HasTraits):
    """ Holds an instance of a Model Mesh that has been only scaled (not transformed)."""

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), show_label=False),
                     resizable=True # We need this to resize with the parent widget
                     )

    @on_trait_change('scene.activated')
    def update_content(self):
        super().update(self.scene)

class ReliefMeshContent(MeshContent, HasTraits):
    """ Holds an instance of a Relief Mesh """

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), show_label=False),
                     resizable=True # We need this to resize with the parent widget
                     )

    @on_trait_change('scene.activated')
    def update_content(self):
        super().update(self.scene)

class MeshContainer(QtWidgets.QWidget):
    """ The QWidget containing the visualization, this is pure PyQt5 code. """

    def __init__(self, data: np.ndarray, mesh_type: MeshType, parent=None) -> None:
        """ Initialization. """
        super().__init__(parent)
        self.mesh_type = mesh_type

        layout = QtWidgets.QVBoxLayout(self)
        layout.setContentsMargins(0,0,0,0)
        layout.setSpacing(0)

        if self.mesh_type == MeshType.Model:
            self.mesh_content = ModelMeshContent(data, self.mesh_type)
        if self.mesh_type == MeshType.ModelScaled:
            self.mesh_content = ModelMeshScaledContent(data, self.mesh_type)
        if self.mesh_type == MeshType.Relief:
            self.mesh_content = ReliefMeshContent(data, self.mesh_type)

        # If you want to debug, beware that you need to remove the Qt input hook.
        #QtCore.pyqtRemoveInputHook()
        #import pdb ; pdb.set_trace()
        #QtCore.pyqtRestoreInputHook()

        # The edit_traits call will generate the widget to embed.
        self.ui = self.mesh_content.edit_traits(parent=self, kind='subpanel').control
        layout.addWidget(self.ui)
        self.ui.setParent(self)

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

        self.settings_file = settings_file
        self.settings = self.load_settings(self.settings_file)
        self.working = working

        # results
        self.results: Results = Results()

        self.qapp = qapp
        self.resize_timer: Optional[QtCore.QTimer] = None

        # initialize UI
        self.image_tabs: Dict[ImageType, ImageTab] = {}
        self.mesh_tabs: Dict[MeshType, MeshTab] = {}
        self.initialize_ui()

        # event handlers
        self.initialize_handlers()

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

    @benchmark()
    def initialize_ui(self)-> None:
        """ 
        Initialize the UI
        """
        self.ui = explorer_ui.Ui_MainWindow()
        self.ui.setupUi(self)

        #intialize settings
        self.initialize_settings()

        # solve
        self.calculate()

    def resize_ui(self)-> None:
        """ Handles a resize event for the main window. """

        if len(self.image_tabs) <= 0:
            self.construct_tabs()
            return

        self.set_busy (True)

        for _, value in self.image_tabs.items():
            value.construct_tab()

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

    def initialize_settings(self) ->None:
        mesh_transform:Dict[str, float] = self.settings['MeshTransform']

        self.ui.gradientThresholdLineEdit.setText(str(mesh_transform['GradientThreshold']))
        self.ui.attenuationFactorLineEdit.setText(str(mesh_transform['AttenuationFactor']))
        self.ui.attenuationDecayLineEdit.setText(str(mesh_transform['AttenuationDecay']))
        self.ui.unsharpGaussianLowLineEdit.setText(str(mesh_transform['UnsharpGaussianLow']))
        self.ui.unsharpGaussianHighLineEdit.setText(str(mesh_transform['UnsharpGaussianHigh']))
        self.ui.unsharpHFScaleLineEdit.setText(str(mesh_transform['UnsharpHighFrequencyScale']))

        self.ui.p1LineEdit.setText(str(mesh_transform['P1']))
        self.ui.p2LineEdit.setText(str(mesh_transform['P2']))
        self.ui.p3LineEdit.setText(str(mesh_transform['P3']))
        self.ui.p4LineEdit.setText(str(mesh_transform['P4']))
        self.ui.p5LineEdit.setText(str(mesh_transform['P5']))
        self.ui.p6LineEdit.setText(str(mesh_transform['P6']))
        self.ui.p7LineEdit.setText(str(mesh_transform['P7']))
        self.ui.p8LineEdit.setText(str(mesh_transform['P8']))

        checkbox_enabled = True
        self.ui.gradientThresholdCheckBox.setChecked(checkbox_enabled)
        self.ui.attenuationCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpMaskingCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpGaussianLowCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpGaussianHighCheckBox.setChecked(checkbox_enabled)
        self.ui.unsharpHFScaleCheckBox.setChecked(checkbox_enabled)

        self.ui.p1CheckBox.setChecked(checkbox_enabled)
        self.ui.p2CheckBox.setChecked(checkbox_enabled)
        self.ui.p3CheckBox.setChecked(checkbox_enabled)
        self.ui.p4CheckBox.setChecked(checkbox_enabled)
        self.ui.p5CheckBox.setChecked(checkbox_enabled)
        self.ui.p6CheckBox.setChecked(checkbox_enabled)
        self.ui.p7CheckBox.setChecked(checkbox_enabled)
        self.ui.p8CheckBox.setChecked(checkbox_enabled)

    def initialize_handlers(self)-> None:
        """ Initialize event handlers """
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
        self.update_tabs(preserve_camera=True)

    def handle_open_settings(self) ->None:
        """
        Opens a new settings file.
        """
        dialog = QtWidgets.QFileDialog()
        dialog.setFileMode(QtWidgets.QFileDialog.AnyFile)
        dialog.setNameFilter("All JSON files (*.json)")

        if dialog.exec_():
            filenames = dialog.selectedFiles()
            self.settings_file = filenames[0]
            self.settings = self.load_settings(self.settings_file)

            self.initialize_settings()
            self.calculate()
            self.update_tabs(preserve_camera=True)

    def calculate(self) -> None:
        """ 
        Transfor the active model using the MeshTransform.
        """
        self.set_busy (True)

        solver = Solver(self.settings_file, self.working)

        #enable processing steps
        solver.enable_gradient_threshold = self.ui.gradientThresholdCheckBox.isChecked()
        solver.enable_attenuation = self.ui.attenuationCheckBox.isChecked()
        solver.enable_unsharpmask = self.ui.unsharpMaskingCheckBox.isChecked()
        solver.enable_unsharpmask_gaussian_high = self.ui.unsharpGaussianLowCheckBox.isChecked()
        solver.enable_unsharpmask_gaussian_low = self.ui.unsharpGaussianHighCheckBox.isChecked()
        solver.enable_unsharpmask_high_frequence_scale = self.ui.unsharpHFScaleCheckBox.isChecked()

        solver.enable_p1 = self.ui.p1CheckBox.isChecked()
        solver.enable_p2 = self.ui.p2CheckBox.isChecked()
        solver.enable_p3 = self.ui.p3CheckBox.isChecked()
        solver.enable_p4 = self.ui.p4CheckBox.isChecked()
        solver.enable_p5 = self.ui.p5CheckBox.isChecked()
        solver.enable_p6 = self.ui.p6CheckBox.isChecked()
        solver.enable_p7 = self.ui.p7CheckBox.isChecked()
        solver.enable_p8 = self.ui.p8CheckBox.isChecked()

        # solve
        solver.transform()
        self.results = solver.results

        self.set_busy (False)

    def construct_tabs(self) -> None:
        """ 
        Construct the result tabs with the images, meshes, etc. from the calculated solution.
        """
        # image views
        self.image_tabs[ImageType.DepthBuffer]      = ImageTab(self.ui.depthBufferTab, ImageType.DepthBuffer, "DepthBuffer", "gray", ImageTab.add_image, self.results.depth_buffer_model)
        self.image_tabs[ImageType.Relief]           = ImageTab(self.ui.reliefTab, ImageType.Relief, "Relief", "gray", ImageTab.add_image, self.results.mesh_scaled)
        self.image_tabs[ImageType.BackgroundMask]   = ImageTab(self.ui.backgroundMaskTab, ImageType.BackgroundMask, "Background Mask", "gray", ImageTab.add_image, self.results.depth_buffer_mask)
        self.image_tabs[ImageType.GradientX]        = ImageTab(self.ui.gradientXTab, ImageType.GradientX, "Gradient X: dI(x,y)/dx", "Blues_r", ImageTab.add_image, self.results.gradient_x)
        self.image_tabs[ImageType.GradientXMask]    = ImageTab(self.ui.gradientXMaskTab, ImageType.GradientXMask, "Gradient X Mask", "gray", ImageTab.add_image, self.results.gradient_x_mask)
        self.image_tabs[ImageType.GradientY]        = ImageTab(self.ui.gradientYTab, ImageType.GradientY, "Gradient Y: dI(x,y)/dy", "Blues_r", ImageTab.add_image, self.results.gradient_y)
        self.image_tabs[ImageType.GradientYMask]    = ImageTab(self.ui.gradientYMaskTab, ImageType.GradientYMask, "Gradient Y Mask", "gray", ImageTab.add_image, self.results.gradient_y_mask)
        self.image_tabs[ImageType.CompositeMask]    = ImageTab(self.ui.compositeMaskTab, ImageType.CompositeMask, "Composite Mask", "gray", ImageTab.add_image, self.results.combined_mask)
        self.image_tabs[ImageType.GradientXUnsharp] = ImageTab(self.ui.gradientXUnsharpTab, ImageType.GradientXUnsharp, "Gradient X Unsharp", "Blues_r", ImageTab.add_image, self.results.gradient_x_unsharp)
        self.image_tabs[ImageType.GradientYUnsharp] = ImageTab(self.ui.gradientYUnsharpTab, ImageType.GradientYUnsharp, "Gradient Y Unsharp", "Blues_r", ImageTab.add_image, self.results.gradient_y_unsharp)

        # mesh views
        self.mesh_tabs[MeshType.Model]  = MeshTab(self.ui.modelMeshTab,  MeshType.Model,  "Model", "Blues_r", self.results.depth_buffer_model)
        self.mesh_tabs[MeshType.ModelScaled]  = MeshTab(self.ui.modelMeshScaledTab,  MeshType.ModelScaled,  "Model Scaled", "Blues_r", self.results.mesh_scaled)
        self.mesh_tabs[MeshType.Relief] = MeshTab(self.ui.reliefMeshTab, MeshType.Relief, "Relief", "Blues_r", self.results.mesh_transformed)

        # workbench views
        self.image_tabs[ImageType.Image1] = ImageTab(self.ui.i1Tab, ImageType.Image1, "Image One", "gray", ImageTab.add_image, self.results.i1)
        self.image_tabs[ImageType.Image2] = ImageTab(self.ui.i2Tab, ImageType.Image2, "Image Two", "gray", ImageTab.add_image, self.results.i2)
        self.image_tabs[ImageType.Image3] = ImageTab(self.ui.i3Tab, ImageType.Image3, "Image Three", "gray", ImageTab.add_image, self.results.i3)
        self.image_tabs[ImageType.Image4] = ImageTab(self.ui.i4Tab, ImageType.Image4, "Image Four", "gray", ImageTab.add_image, self.results.i4)
        self.image_tabs[ImageType.Image5] = ImageTab(self.ui.i5Tab, ImageType.Image5, "Image Five", "gray", ImageTab.add_image, self.results.i5)
        self.image_tabs[ImageType.Image6] = ImageTab(self.ui.i6Tab, ImageType.Image6, "Image Six", "gray", ImageTab.add_image, self.results.i6)

    def update_tabs(self, preserve_camera: bool = True) -> None:
        """ Update the result tabs with the images, meshes, etc. from the calculated solution.
        Parameters
        ----------
        preserve_camera
            Preserve camera settings for a view to maintain continuity across parameter changes.
    """
        self.set_busy (True)

        # Images
        self.image_tabs[ImageType.DepthBuffer].data       = self.results.depth_buffer_model
        self.image_tabs[ImageType.Relief].data            = self.results.mesh_scaled
        self.image_tabs[ImageType.BackgroundMask].data    = self.results.depth_buffer_mask
        self.image_tabs[ImageType.GradientX].data         = self.results.gradient_x
        self.image_tabs[ImageType.GradientXMask].data     = self.results.gradient_x_mask
        self.image_tabs[ImageType.GradientY].data         = self.results.gradient_y
        self.image_tabs[ImageType.GradientYMask].data     = self.results.gradient_y_mask
        self.image_tabs[ImageType.CompositeMask].data     = self.results.combined_mask
        self.image_tabs[ImageType.GradientXUnsharp].data  = self.results.gradient_x_unsharp
        self.image_tabs[ImageType.GradientYUnsharp].data  = self.results.gradient_y_unsharp

        # Meshes
        self.mesh_tabs[MeshType.Model].mesh_widget.mesh_content.set_mesh(self.results.depth_buffer_model, preserve_camera)
        self.mesh_tabs[MeshType.ModelScaled].mesh_widget.mesh_content.set_mesh(self.results.mesh_scaled, preserve_camera)
        self.mesh_tabs[MeshType.Relief].mesh_widget.mesh_content.set_mesh(self.results.mesh_transformed, preserve_camera)

        # Workbench
        self.image_tabs[ImageType.Image1].data = self.results.i1
        self.image_tabs[ImageType.Image2].data = self.results.i2
        self.image_tabs[ImageType.Image3].data = self.results.i3
        self.image_tabs[ImageType.Image4].data = self.results.i4
        self.image_tabs[ImageType.Image5].data = self.results.i5
        self.image_tabs[ImageType.Image6].data = self.results.i6

        self.set_busy (False)
