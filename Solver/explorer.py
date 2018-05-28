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
from typing import Callable, Dict

from solver import Solver
import explorer_ui

class ImageType(Enum):
    """
    A class representing the various UI image view types.
    """
    DepthBuffer = 1,
    BackgroundMask = 2,
    GradientX = 3,
    GradientXMask = 4,
    GradientY = 5,
    GradientYMask = 6,
    CompositeMask = 7

class MeshType(Enum):
    """
    A class representing the various UI mesh view types.
    """
    GradientX = 1,
    GradientY = 2,
    Model = 3

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
            Regenerates the matplotlib Figure.
        """
        self._data = value

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

        figure.set_size_inches(n_subplots * Explorer.CONTENT_DIMENSIONS, Explorer.CONTENT_DIMENSIONS)
        figure.tight_layout()

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

    @property
    def data(self) -> np.ndarray:
        """ Returns the backing Numpy ndarray. """
        return self._data

    @data.setter
    def data (self, value: np.ndarray): 
        """ Sets the NumPy data array."""
        self._data = value

    def update(self, scene):
        # This function is called when the view is opened. We don'tpopulate the scene 
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

        # clear figure
        mlab.clf(figure=scene.mayavi_scene)
        current_figure = mlab.gcf()
        mlab.figure(figure=current_figure, bgcolor=(0, 0, 0))
        # create new figure
        mlab.mesh(X, Y, Z, figure=scene.mayavi_scene)

class GradientXMeshContent(MeshContent, HasTraits):
    """ Holds an instance of a Gradient X Mesh """

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())   
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), height=250, width=300, show_label=False),
                     resizable=True # We need this to resize with the parent widget
                     )

    @on_trait_change('scene.activated')
    def update_content(self):
        super().update(self.scene)

class GradientYMeshContent(MeshContent, HasTraits):
    """ Holds an instance of a Gradient Y Mesh """

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), height=250, width=300, show_label=False),
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

        if self.mesh_type == MeshType.GradientX:
            self.mesh_content = GradientXMeshContent(data, self.mesh_type)
        if self.mesh_type == MeshType.GradientY:
            self.mesh_content = GradientYMeshContent(data, self.mesh_type)

        # If you want to debug, beware that you need to remove the Qt input hook.
        #QtCore.pyqtRemoveInputHook()
        #import pdb ; pdb.set_trace()
        #QtCore.pyqtRestoreInputHook()

        # The edit_traits call will generate the widget to embed.
        self.ui = self.mesh_content.edit_traits(parent=self, kind='subpanel').control
        layout.addWidget(self.ui)
        self.ui.setParent(self)

class Explorer():

    CONTENT_DIMENSIONS = 8
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
        self.settings = settings
        self.working = working
        self.solver = Solver(settings, working)

        self.qapp = qapp

        # initialize UI
        self.image_tabs: Dict[ImageType, ImageTab] = {}
        self.mesh_tabs: Dict[MeshType, MeshTab] = {}
        self.initialize_ui()
     
        # event handlers
        self.initialize_handlers()

    def initialize_ui(self)-> None:
        self.window = QtWidgets.QMainWindow()
        self.ui = explorer_ui.Ui_MainWindow() 
        self.ui.setupUi(self.window)

        # image views
        default_image = np.zeros(shape=(2,2))
        self.image_tabs[ImageType.DepthBuffer]    = ImageTab(self.ui.depthBufferTab, ImageType.DepthBuffer, "DepthBuffer", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.BackgroundMask] = ImageTab(self.ui.backgroundMaskTab, ImageType.BackgroundMask, "Background Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientX]      = ImageTab(self.ui.gradientXTab, ImageType.GradientX, "Gradient X: dI(x,y)/dx", "Blues_r", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientXMask]  = ImageTab(self.ui.gradientXMaskTab, ImageType.GradientXMask, "Gradient X Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientY]      = ImageTab(self.ui.gradientYTab, ImageType.GradientY, "Gradient Y: dI(x,y)/dy", "Blues_r", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.GradientYMask]  = ImageTab(self.ui.gradientYMaskTab, ImageType.GradientYMask, "Gradient Y Mask", "gray", ImageTab.add_image, default_image)
        self.image_tabs[ImageType.CompositeMask]  = ImageTab(self.ui.compositeMaskTab, ImageType.CompositeMask, "Composite Mask", "gray", ImageTab.add_image, default_image)

        # mesh views
        default_mesh = np.zeros(shape=(2,2))
        ridge_mesh = np.array([[0.0, 0.0, 0.0, 0.0, 0.0],
                               [0.0, 0.0, 3.0, 0.0, 0.0],
                               [0.0, 0.0, 3.0, 0.0, 0.0],
                               [0.0, 0.0, 3.0, 0.0, 0.0],
                               [0.0, 0.0, 0.0, 0.0, 0.0]])

        corner_mesh = np.array([[1.0, 0.0, 0.0, 0.0, 1.0],
                                [0.0, 0.0, 0.0, 0.0, 0.0],
                                [0.0, 0.0, 0.0, 0.0, 0.0],
                                [0.0, 0.0, 0.0, 0.0, 0.0],
                                [1.0, 0.0, 0.0, 0.0, 1.0]])


        self.mesh_tabs[MeshType.GradientX] = MeshTab(self.ui.gradientXMeshTab, MeshType.GradientX, "Gradient X Mesh", "Blues_r", ridge_mesh)
        self.mesh_tabs[MeshType.GradientY] = MeshTab(self.ui.gradientYMeshTab, MeshType.GradientY, "Gradient Y Mesh", "Blues_r", corner_mesh)
       
        # https://www.blog.pythonlibrary.org/2015/08/18/getting-your-screen-resolution-with-python/
        self.window.resize(Explorer.WINDOW_WIDTH, Explorer.WINDOW_HEIGHT)

        #intialize settings
        self.initialize_settings()

    def initialize_settings(self) ->None:
        self.ui.tauLineEdit.setText(str(self.solver.mesh_transform.tau))
        self.ui.attenuationLineEdit.setText(str("10.0"))
        self.ui.gaussianBlurLineEdit.setText(str(self.solver.mesh_transform.gaussian_blur))
        self.ui.gaussianSmoothLineEdit.setText(str(self.solver.mesh_transform.gaussian_smooth))
        self.ui.lambdaLineEdit.setText(str(self.solver.mesh_transform.lambda_scale))

        self.ui.tauCheckBox.setChecked(True)
        self.ui.attenuationCheckBox.setChecked(True)
        self.ui.gaussianSmoothCheckBox.setChecked(True)
        self.ui.gaussianBlurCheckBox.setChecked(True)
        self.ui.lambdaCheckBox.setChecked(True)

    def initialize_handlers(self)-> None:
        """ Initialize event handlers """
        self.ui.processButton.clicked.connect(self.handle_process)
        self.ui.actionOpen.triggered.connect(self.handle_open_settings)

    def handle_process(self) ->None:
        """
        Recalculates the views.
        """
        self.solver.mesh_transform.tau = float(self.ui.tauLineEdit.text())
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

    def show(self) ->None:
        """ Show the MainWindow. """
        self.window.show()

    def calculate_images(self) -> None:
        """
        Updates the image view data : DepthBuffer and the supporting gradients and masks.
        """
        depth_buffer = self.solver.depth_buffer.floats
        depth_buffer_mask = self.solver.depth_buffer.background_mask

        gradient_x = self.solver.depth_buffer.gradient_x
        gradient_y = self.solver.depth_buffer.gradient_y

        threshold = self.solver.mesh_transform.tau if self.ui.tauCheckBox.isChecked() else float("inf")
        gradient_x_mask = self.solver.mask.mask_threshold(gradient_x, threshold)
        gradient_y_mask = self.solver.mask.mask_threshold(gradient_y, threshold)

        gradient_x = self.solver.threshold.apply(gradient_x, threshold)
        gradient_y = self.solver.threshold.apply(gradient_y, threshold)

        combined_mask = depth_buffer_mask * gradient_x_mask * gradient_y_mask

        self.image_tabs[ImageType.DepthBuffer].data    = depth_buffer
        self.image_tabs[ImageType.BackgroundMask].data = depth_buffer_mask
        self.image_tabs[ImageType.GradientX].data      = gradient_x
        self.image_tabs[ImageType.GradientXMask].data  = gradient_x_mask
        self.image_tabs[ImageType.GradientY].data      = gradient_y
        self.image_tabs[ImageType.GradientYMask].data  = gradient_y_mask
        self.image_tabs[ImageType.CompositeMask].data  = combined_mask

    def calculate_meshes(self) -> None:
        """
        Updates the meshes.
        """
        self.mesh_tabs[MeshType.GradientX].mesh_widget.mesh_content.data = self.image_tabs[ImageType.GradientX].data
        self.mesh_tabs[MeshType.GradientX].mesh_widget.mesh_content.update_content()

        self.mesh_tabs[MeshType.GradientY].mesh_widget.mesh_content.data = self.image_tabs[ImageType.GradientY].data
        self.mesh_tabs[MeshType.GradientY].mesh_widget.mesh_content.update_content()

    def calculate(self) -> None:
        """ Update the UI with the representations of the DepthBuffer and Mesh."""
        self.calculate_images()
        self.calculate_meshes()
