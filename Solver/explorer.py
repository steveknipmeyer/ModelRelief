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
from mpl_toolkits.mplot3d import Axes3D

from traits.api import HasTraits, Instance, on_trait_change
from traitsui.api import View, Item
from mayavi.core.ui.api import MayaviScene, MlabSceneModel, SceneEditor
from mayavi import mlab

import numpy as np
from numpy import pi, sin, cos, mgrid
from enum import Enum
from typing import Callable, Dict, Optional

from attenuation import AttenuationParameters
from difference import FiniteDifference
from mathtools import MathTools
from poisson import Poisson
from solver import Solver

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
    Relief = 2

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

    def construct_tab (self):
        """ Constructs the UI tab with the image content.
            Regenerates the matplotlib Figure.
        """

        if (self.figure != None):
            plt.close(self.figure)
        self.figure = self.construct_subplot_figures ([self._data], 1, [self.title], [self.cmap])

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
        mlab.mesh(X, Y, Z, figure=current_figure)

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

    WINDOW_WIDTH = 1086
    WINDOW_HEIGHT = 960

    def __init__(self, settings: str, working: str, qapp : QtWidgets.QApplication) -> None:
        """Perform class initialization.
        Parameters
        ----------
        settings
            The JSON settings file for a Mesh.
        working
            The working folder to be used for intermediate results.
        """
        super().__init__()

        self.debug = True
        self.settings = settings
        self.working = working
        self.solver = Solver(settings, working)

        self.depth_buffer: np.ndarray = None
        self.depth_buffer_mask: np.ndarray = None
        self.gradient_x: np.ndarray = None
        self.gradient_x_mask: np.ndarray = None
        self.gradient_y: np.ndarray = None
        self.gradient_y_mask: np.ndarray = None
        self.combined_mask: np.ndarray = None
        self.gradient_x_unsharp: np.ndarray = None
        self.gradient_y_unsharp: np.ndarray = None

        self.qapp = qapp
        self.resize_timer: Optional[QtCore.QTimer] = None

        # initialize UI
        self.image_tabs: Dict[ImageType, ImageTab] = {}
        self.mesh_tabs: Dict[MeshType, MeshTab] = {}
        self.initialize_ui()

        # event handlers
        self.initialize_handlers()

    def initialize_ui(self)-> None:
        self.ui = explorer_ui.Ui_MainWindow()
        self.ui.setupUi(self)

        # image views
        default_image = np.zeros(shape=(2,2))
        self.image_tabs[ImageType.DepthBuffer]      = ImageTab(self.ui.depthBufferTab, ImageType.DepthBuffer, "DepthBuffer", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.Relief]           = ImageTab(self.ui.reliefTab, ImageType.Relief, "Relief", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.BackgroundMask]   = ImageTab(self.ui.backgroundMaskTab, ImageType.BackgroundMask, "Background Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientX]        = ImageTab(self.ui.gradientXTab, ImageType.GradientX, "Gradient X: dI(x,y)/dx", "Blues_r", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientXMask]    = ImageTab(self.ui.gradientXMaskTab, ImageType.GradientXMask, "Gradient X Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientY]        = ImageTab(self.ui.gradientYTab, ImageType.GradientY, "Gradient Y: dI(x,y)/dy", "Blues_r", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientYMask]    = ImageTab(self.ui.gradientYMaskTab, ImageType.GradientYMask, "Gradient Y Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.CompositeMask]    = ImageTab(self.ui.compositeMaskTab, ImageType.CompositeMask, "Composite Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientXUnsharp] = ImageTab(self.ui.gradientXUnsharpTab, ImageType.GradientXUnsharp, "Gradient X Unsharp", "Blues_r", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientYUnsharp] = ImageTab(self.ui.gradientYUnsharpTab, ImageType.GradientYUnsharp, "Gradient Y Unsharp", "Blues_r", ImageTab.add_image, default_image)

        # mesh views
        default_mesh = np.zeros(shape=(2,2))
        self.mesh_tabs[MeshType.Model]  = MeshTab(self.ui.modelMeshTab,  MeshType.Model,  "Model", "Blues_r", default_mesh)
        self.mesh_tabs[MeshType.Relief] = MeshTab(self.ui.reliefMeshTab, MeshType.Relief, "Relief", "Blues_r", default_mesh)

        # https://www.blog.pythonlibrary.org/2015/08/18/getting-your-screen-resolution-with-python/
        self.resize(Explorer.WINDOW_WIDTH, Explorer.WINDOW_HEIGHT)

        #intialize settings
        self.initialize_settings()

    def resize_ui(self)-> None:
        """ Handles a resize event for the main window. """
        for _, value in self.image_tabs.items():
            value.construct_tab()

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
        self.ui.tauLineEdit.setText(str(self.solver.mesh_transform.tau))
        self.ui.attenuationALineEdit.setText(str(self.solver.mesh_transform.attenuation_parameters.a))
        self.ui.attenuationBLineEdit.setText(str(self.solver.mesh_transform.attenuation_parameters.b))
        self.ui.gaussianLowLineEdit.setText(str(self.solver.mesh_transform.gaussian_low))
        self.ui.gaussianHighLineEdit.setText(str(self.solver.mesh_transform.gaussian_high))
        self.ui.lambdaLineEdit.setText(str(self.solver.mesh_transform.lambda_scale))

        checkbox_enabled = False
        self.ui.tauCheckBox.setChecked(checkbox_enabled)
        self.ui.attenuationCheckBox.setChecked(checkbox_enabled)
        self.ui.gaussianLowCheckBox.setChecked(checkbox_enabled)
        self.ui.gaussianHighCheckBox.setChecked(checkbox_enabled)
        self.ui.lambdaCheckBox.setChecked(checkbox_enabled)

    def initialize_handlers(self)-> None:
        """ Initialize event handlers """
        self.ui.processButton.clicked.connect(self.handle_process)
        self.ui.actionOpen.triggered.connect(self.handle_open_settings)

    def handle_process(self) ->None:
        """
        Recalculates the views.
        """
        # threshold
        self.solver.mesh_transform.tau = float(self.ui.tauLineEdit.text())

        # attenuation
        self.solver.mesh_transform.attenuation_parameters.a = float(self.ui.attenuationALineEdit.text())
        self.solver.mesh_transform.attenuation_parameters.b = float(self.ui.attenuationBLineEdit.text())

        # unsharp masking
        self.solver.mesh_transform.gaussian_low = float(self.ui.gaussianLowLineEdit.text())
        self.solver.mesh_transform.gaussian_high = float(self.ui.gaussianHighLineEdit.text())
        self.solver.mesh_transform.lambda_scale = float(self.ui.lambdaLineEdit.text())

        self.calculate()

    def handle_open_settings(self) ->None:
        """
        Opens a new settings file.
        """
        dialog = QtWidgets.QFileDialog()
        dialog.setFileMode(QtWidgets.QFileDialog.AnyFile)
        dialog.setNameFilter("All JSON files (*.json)")

        if dialog.exec_():
            filenames = dialog.selectedFiles()
            self.solver = Solver(filenames[0], self.working)
            self.initialize_settings()
            self.calculate()

    def calculate_images(self) -> None:
        """
        Updates the image view data : DepthBuffer and the supporting gradients and masks.
        """
        calculate_images_step = self.solver.services.stopwatch.mark("calculate_images")

        # background mask
        self.depth_buffer = self.solver.depth_buffer.floats
        self.depth_buffer_mask = self.solver.depth_buffer.background_mask

        self.gradient_x = self.solver.depth_buffer.gradient_x
        self.gradient_y = self.solver.depth_buffer.gradient_y

        # Apply threshold to <entire> calculated gradient to find gradient masks.
        threshold = self.solver.mesh_transform.tau if self.ui.tauCheckBox.isChecked() else float("inf")
        self.gradient_x_mask = self.solver.mask.mask_threshold(self.gradient_x, threshold)
        self.gradient_y_mask = self.solver.mask.mask_threshold(self.gradient_y, threshold)

        # Modify gradient by applying threshold, setting values above threshold to zero.
        self.gradient_x = self.solver.threshold.apply(self.gradient_x, threshold)
        self.gradient_y = self.solver.threshold.apply(self.gradient_y, threshold)

        # Composite mask: Values are processed only if they pass all three masks.
        #    A value must have a 1 in the background mask.
        #    A value must have both dI/dx <and> dI/dy that are 1 in the respective gradient masks.
        self.combined_mask = self.gradient_x_mask * self.gradient_y_mask
        #self.combined_mask = self.combined_mask * self.depth_buffer_mask

        # Mask the thresholded gradients.
        self.gradient_x = self.gradient_x * self.combined_mask
        self.gradient_y = self.gradient_y * self.combined_mask

        # Attenuate the gradient to reduce high values and boost small values (acceuntuating some detail.)
        if self.ui.attenuationCheckBox.isChecked():
            self.gradient_x = self.solver.attenuation.apply(self.gradient_x, self.solver.mesh_transform.attenuation_parameters)
            self.gradient_y = self.solver.attenuation.apply(self.gradient_y, self.solver.mesh_transform.attenuation_parameters)

        # unsharp masking
        gaussian_low = self.solver.mesh_transform.gaussian_low if self.ui.gaussianLowCheckBox.isChecked() else 0.0
        gaussian_high = self.solver.mesh_transform.gaussian_high if self.ui.gaussianHighCheckBox.isChecked() else 0.0
        lambda_scale = self.solver.mesh_transform.lambda_scale if self.ui.lambdaCheckBox.isChecked() else 1.0

        self.gradient_x_unsharp = self.solver.unsharpmask.apply(self.gradient_x, self.combined_mask, gaussian_low, gaussian_high, lambda_scale)
        self.gradient_y_unsharp = self.solver.unsharpmask.apply(self.gradient_y, self.combined_mask, gaussian_low, gaussian_high, lambda_scale)

        self.solver.services.stopwatch.log_time(calculate_images_step)

        self.image_tabs[ImageType.DepthBuffer].data       = self.depth_buffer
        self.image_tabs[ImageType.BackgroundMask].data    = self.depth_buffer_mask
        self.image_tabs[ImageType.GradientX].data         = self.gradient_x
        self.image_tabs[ImageType.GradientXMask].data     = self.gradient_x_mask
        self.image_tabs[ImageType.GradientY].data         = self.gradient_y
        self.image_tabs[ImageType.GradientYMask].data     = self.gradient_y_mask
        self.image_tabs[ImageType.CompositeMask].data     = self.combined_mask
        self.image_tabs[ImageType.GradientXUnsharp].data  = self.gradient_x_unsharp
        self.image_tabs[ImageType.GradientYUnsharp].data  = self.gradient_y_unsharp

    def calculate_meshes(self, preserve_camera: bool = True) -> None:
        """
        Updates the meshes.
        """
        calculate_mesh_step = self.solver.services.stopwatch.mark("calculate_mesh")

        # calculate divergence
        dGxdx = self.solver.difference.difference_x(self.gradient_x_unsharp, FiniteDifference.Backward)
        dGydy = self.solver.difference.difference_y(self.gradient_y_unsharp, FiniteDifference.Backward)
        divG = dGxdx + dGydy

        mesh = self.solver.poisson.solve(divG)

        self.solver.services.stopwatch.log_time(calculate_mesh_step)

        if (self.debug):
            (rows, _) = self.solver.depth_buffer.floats.shape
            maximum_rows = 16
            if rows <= maximum_rows:
                print ("Results")
                print ("------------------------------------------------------------")
                MathTools.print_array("I", self.solver.depth_buffer.floats)
                MathTools.print_array("Gx", self.gradient_x)
                MathTools.print_array("dGxdx", dGxdx)
                MathTools.print_array("Gy", self.gradient_y)
                MathTools.print_array("dGydy", dGydy)
                MathTools.print_array("divG", divG)
                MathTools.print_array("Poisson Solution", mesh)

        # relief image
        self.image_tabs[ImageType.Relief].data = mesh

        # model mesh (from DepthBuffer)
        depth_buffer = self.image_tabs[ImageType.DepthBuffer].data
        self.mesh_tabs[MeshType.Model].mesh_widget.mesh_content.set_mesh(depth_buffer, preserve_camera)

        # relief mesh
        self.mesh_tabs[MeshType.Relief].mesh_widget.mesh_content.set_mesh(mesh, preserve_camera)

    def calculate(self, preserve_camera: bool = True) -> None:
        """ Update the UI with the representations of the DepthBuffer and Mesh."""
        self.calculate_images()
        self.calculate_meshes(preserve_camera)
