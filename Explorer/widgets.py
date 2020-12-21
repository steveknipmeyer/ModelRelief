#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: widgets
   :synopsis: QT UI controls for Explorer.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""

import os
# First, and before importing any Enthought packages, set the ETS_TOOLKIT environment variable to qt4 to tell Traits that we will use Qt.
# https://github.com/enthought/traitsui/issues/407
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

from traits.api import HasTraits, Instance, on_trait_change
from traitsui.api import View, Item
from mayavi.core.ui.api import MayaviScene, MlabSceneModel, SceneEditor
from mayavi import mlab

import numpy as np
from numpy import pi, sin, cos, mgrid
from enum import Enum
from typing import Any, Callable, Dict, Optional

from results import Results, DataSource

# ------------------------------------------#
#                 Images                    #
# ------------------------------------------#
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
    Image7 = 17,
    Image8 = 18,

class ImageTab():
    """ A UI tab of an image view. """

    def __init__(self, widget: QtWidgets.QWidget, image_type: ImageType, cmap: str, content_ctor: Callable[[Figure, plt.Axes, np.ndarray, str, str], Figure], source: DataSource) -> None:
        """ A UI image tab in the Explorer.
        Parameters
        ----------
        widget
            QWidget of the tab.
        image_type
            The type of the image.
        cmap
            The matplotlib colormap.
        content_ctor
            The content constructor function that populates the given figure.
        data
            The Numpy array holding the image data.
        """
        self.widget = widget
        self.image_type = image_type
        self.cmap = cmap

        self.figure: Figure = None
        self.canvas: FigureCanvas = None
        self.scroll: QtWidgets.QScrollArea = None
        self.nav: NavigationToolbar = None

        self.content_ctor = content_ctor
        self.source = source

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

    def construct (self):
        """ Constructs the UI tab with the image content.
            Regenerates the matplotlib Figure.
        """

        figure_exists = self.figure != None
        if figure_exists:
            viewLim = self.get_view_extents(self.figure)
            plt.close(self.figure)

        # construct image figure
        data = self.source.data
        self.figure = self.construct_subplot_figures ([data.image], 1, [data.title], [self.cmap])

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

    def update (self):
        """ Updates the UI tab with the image content.
        """
        if self.source.dirty:
            self.construct()
            self.source.dirty = False

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

        columns = int(np.ceil(n_subplots/float(rows)))
        for n, (data_array, title, cmap) in enumerate(zip(data, titles, cmaps)):
            # make a subplot active
            subplot = figure.add_subplot(rows, columns, n + 1)

            figure = self.content_ctor(figure, subplot, data_array, title, cmap)

        self.size_figure(figure, n_subplots)

        return figure

# ------------------------------------------#
#                 Meshes                    #
# ------------------------------------------#
class MeshType(Enum):
    """
    A class representing the various UI mesh view types.
    """
    Model  = 1,
    ModelScaled  = 2,
    Relief = 3

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

class MeshContent(HasTraits):
    """ Holds an instance of a 3D Mesh """

    def __init__ (self, source: DataSource, mesh_type: MeshType) -> None:
        """ Initialization.
        Parameters
        ----------
        source
            The Solver data source for the mesh.
        mesh_type
            The type of the mesh.
        """
        super().__init__()

        self.source = source
        self.mesh_type = mesh_type
        self.camera: Optional[Camera] = None

    def update(self, preserve_camera:bool = True):
        """
        Update the mesh if necessary.
        Parameters
        ----------
        preserve_camera
            Preserve the existing camera settings in the view.
        """
        if self.source.dirty:
            self.construct(self.scene)
            if preserve_camera and self.camera is not None:
                self.camera.apply()
            self.source.dirty = False

    def construct(self, scene):
        # This function is called when the view is opened. We don't populate the scene
        # when the view is not yet open, as some VTK features require a GLContext.

        shape = self.source.data.image.shape
        width = shape[1]
        height = shape[0]
        X = np.arange(0, width, 1.0)
        Y = np.arange(0, height, 1.0)

        X, Y = np.meshgrid(X, Y)
        Z = self.source.data.image

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
        super().construct(self.scene)

class ModelMeshScaledContent(MeshContent, HasTraits):
    """ Holds an instance of a Model Mesh that has been only scaled (not transformed)."""

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), show_label=False),
                     resizable=True # We need this to resize with the parent widget
                     )

    @on_trait_change('scene.activated')
    def update_content(self):
        super().construct(self.scene)

class ReliefMeshContent(MeshContent, HasTraits):
    """ Holds an instance of a Relief Mesh """

    # N.B. These must be class variables to maintain scene independence.
    scene = Instance(MlabSceneModel, ())
    view = View(Item('scene', editor=SceneEditor(scene_class=MayaviScene), show_label=False),
                     resizable=True # We need this to resize with the parent widget
                     )

    @on_trait_change('scene.activated')
    def update_content(self):
        super().construct(self.scene)

class MeshWidget(QtWidgets.QWidget):
    """ The QWidget containing the visualization, this is pure PyQt5 code. """

    def __init__(self, source: DataSource, mesh_type: MeshType, parent=None) -> None:
        """
        Initialization.
        Parameters
        ----------
        source
            The Solver data source for the mesh.
        mesh_type
            The type of the mesh.
        """
        super().__init__(parent)
        self.mesh_type = mesh_type

        layout = QtWidgets.QVBoxLayout(self)
        layout.setContentsMargins(0,0,0,0)
        layout.setSpacing(0)

        if self.mesh_type == MeshType.Model:
            self.mesh_content = ModelMeshContent(source, self.mesh_type)
        if self.mesh_type == MeshType.ModelScaled:
            self.mesh_content = ModelMeshScaledContent(source, self.mesh_type)
        if self.mesh_type == MeshType.Relief:
            self.mesh_content = ReliefMeshContent(source, self.mesh_type)

        # If you want to debug, beware that you need to remove the Qt input hook.
        #QtCore.pyqtRemoveInputHook()
        #import pdb ; pdb.set_trace()
        #QtCore.pyqtRestoreInputHook()

        # The edit_traits call will generate the widget to embed.
        self.ui = self.mesh_content.edit_traits(parent=self, kind='subpanel').control
        layout.addWidget(self.ui)
        self.ui.setParent(self)

class MeshTab():
    """ A UI tab of a mesh view. """

    def __init__(self, widget: QtWidgets.QWidget, mesh_type: MeshType, title: str, cmap: str, source: DataSource) -> None:
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
        source
            The Solver data source for the mesh.
        """
        self.widget = widget
        self.mesh_type = mesh_type
        self.title = title
        self.cmap = cmap
        self.source = source

        self.mesh_widget = MeshWidget(source, self.mesh_type)
        self.widget.layout().addWidget(self.mesh_widget)