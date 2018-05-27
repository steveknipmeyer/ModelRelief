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
import matplotlib
matplotlib.use('Qt5Agg')
import matplotlib.pyplot as plt

from PyQt5 import QtWidgets
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT as NavigationToolbar
from matplotlib.figure import Figure
from matplotlib.ticker import LinearLocator
from mpl_toolkits.mplot3d import Axes3D

import numpy as np
from enum import Enum
from typing import Callable, Dict

from solver import Solver
import explorer_ui

class ViewType(Enum):
    """
    A class representing the various UI view types.
    """
    DepthBuffer = 1,
    BackgroundMask = 2,
    GradientX = 3,
    GradientXMask = 4,
    GradientY = 5,
    GradientYMask = 6,
    CompositeMask = 7

    IsometricView = 8,
    TopView = 9

class ViewTab():
    """ A UI tab of a mesh view. """

    def __init__(self, widget: QtWidgets.QWidget, view_type: ViewType, title:str, cmap: str, content_ctor: Callable[[Figure, plt.Axes, np.ndarray, str, str], Figure], data: np.ndarray,  ) -> None:
        """ A UI view tab in the Explorer. 
        Parameters
        ----------
        widget
            QWidget of the tab.
        view_type
            The type of the view.
        title
            The title of the view.
        cmap
            The matplotlib colormap.            
        content_ctor
            The content constructor function that populates the given figure.
        data
            The Numpy array holding the view data. 
        """
        # QWidget
        self.widget = widget
        self.view_type = view_type 
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
        self.figure = self.construct_figure(self._data, self.title, self.cmap)
        # self.figure = self.construct_subplot_figures ([self._data], 1, [self.title], [self.cmap])

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
        subplot = plot.axes 

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

    @staticmethod        
    def add_mesh(figure: Figure, subplot: plt.Axes, data: np.ndarray, title: str, cmap: str) -> plt.Figure:
        """ Adds a 3D mesh to the given Figure.
        Parameters
        ---------
        figure
            The Figure to which the mesh will be added.
        subplot
            The subplot Axes of the Figure.
        data
            The data array.
        title 
            The title of the mesh Figure.
        cmap
            The colormap to be used.
        Returns
        -------
        A Figure.
        """
        ax = figure.gca(projection='3d')

        # Make data.
        X = np.arange(-5, 5, 0.25)
        Y = np.arange(-5, 5, 0.25)
        X, Y = np.meshgrid(X, Y)
        R = np.sqrt(X**2 + Y**2)
        Z = np.sin(R)

        colors = np.empty(X.shape, dtype=str)
        colors.fill('b')

        # Plot the surface with face colors taken from the array we made.
        ax.plot_surface(X, Y, Z, facecolors=colors, linewidth=0)

        # Customize the z axis.
        ax.set_zlim(-1, 1)
        ax.w_zaxis.set_major_locator(LinearLocator(6))

        return figure

    def construct_figure(self, data: np.ndarray, title: str, cmap: str) -> plt.Figure:
        """ Contruct a matplotlib Figure from a NumPy data array.
        Parameters
        ---------
        data
            The data array.
        title 
            The title of the Figure.
        cmap
            The colormap to be used.
        Returns
        -------
        A Figure.
        """
        figure = plt.figure(facecolor='black')

        plot = plt.imshow(data, cmap)       
        subplot = plot.axes 

        figure = self.content_ctor(figure, subplot, data, title, cmap)
        # figure = self.add_image(figure, subplot, data, title, cmap)
        # figure = self.add_mesh(figure, subplot, data, title, cmap)

        figure.set_size_inches(Explorer.CONTENT_DIMENSIONS, Explorer.CONTENT_DIMENSIONS)
        figure.tight_layout()

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

            figure = self.add_image(figure, subplot, data_array, title, cmap)

        figure.set_size_inches(n_subplots * Explorer.CONTENT_DIMENSIONS, Explorer.CONTENT_DIMENSIONS)
        figure.tight_layout()

        return figure

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
        self.view_tabs: Dict[ViewType, ViewTab] = {}
        self.initialize_ui()
     
        # event handlers
        self.initialize_handlers()

    def initialize_ui(self)-> None:
        self.window = QtWidgets.QMainWindow()
        self.ui = explorer_ui.Ui_MainWindow() 
        self.ui.setupUi(self.window)

        # images
        default_image = np.zeros(shape=(2,2))
        self.view_tabs[ViewType.DepthBuffer]    = ViewTab(self.ui.depthBufferTab, ViewType.DepthBuffer, "DepthBuffer", "gray", ViewTab.add_image, default_image)
        self.view_tabs[ViewType.BackgroundMask] = ViewTab(self.ui.backgroundMaskTab, ViewType.BackgroundMask, "Background Mask", "gray", ViewTab.add_image, default_image)
        self.view_tabs[ViewType.GradientX]      = ViewTab(self.ui.gradientXTab, ViewType.GradientX, "Gradient X: dI(x,y)/dx", "Blues_r", ViewTab.add_image, default_image)
        self.view_tabs[ViewType.GradientXMask]  = ViewTab(self.ui.gradientXMaskTab, ViewType.GradientXMask, "Gradient X Mask", "gray", ViewTab.add_image, default_image)
        self.view_tabs[ViewType.GradientY]      = ViewTab(self.ui.gradientYTab, ViewType.GradientY, "Gradient Y: dI(x,y)/dy", "Blues_r", ViewTab.add_image, default_image)
        self.view_tabs[ViewType.GradientYMask]  = ViewTab(self.ui.gradientYMaskTab, ViewType.GradientYMask, "Gradient Y Mask", "gray", ViewTab.add_image, default_image)
        self.view_tabs[ViewType.CompositeMask]  = ViewTab(self.ui.compositeMaskTab, ViewType.CompositeMask, "Composite Mask", "gray", ViewTab.add_image, default_image)

        # mesh views
        default_mesh = np.zeros(shape=(2,2))
        self.view_tabs[ViewType.IsometricView] = ViewTab(self.ui.isometricViewTab, ViewType.IsometricView, "Isometric", "gray", ViewTab.add_mesh, default_mesh)
        self.view_tabs[ViewType.TopView]       = ViewTab(self.ui.topViewTab, ViewType.TopView, "Top", "gray", ViewTab.add_mesh, default_mesh)

        self.ui.tauCheckBox.setChecked(True)
        self.ui.attenuationCheckBox.setChecked(True)
        self.ui.gaussianSmoothCheckBox.setChecked(True)
        self.ui.gaussianBlurCheckBox.setChecked(True)
        self.ui.lambdaCheckBox.setChecked(True)
        
        # https://www.blog.pythonlibrary.org/2015/08/18/getting-your-screen-resolution-with-python/
        self.window.resize(Explorer.WINDOW_WIDTH, Explorer.WINDOW_HEIGHT)

        #intialize settings
        self.initialize_settings()

    def initialize_settings(self) ->None:
        self.ui.tauLineEdit.setText(str(self.solver.mesh_transform.tau))
        self.ui.gaussianBlurLineEdit.setText(str(self.solver.mesh_transform.gaussian_blur))
        self.ui.gaussianSmoothLineEdit.setText(str(self.solver.mesh_transform.gaussian_smooth))
        self.ui.lambdaLineEdit.setText(str(self.solver.mesh_transform.lambda_scale))

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

        self.view_tabs[ViewType.DepthBuffer].data    = depth_buffer
        self.view_tabs[ViewType.BackgroundMask].data = depth_buffer_mask
        self.view_tabs[ViewType.GradientX].data      = gradient_x
        self.view_tabs[ViewType.GradientXMask].data  = gradient_x_mask
        self.view_tabs[ViewType.GradientY].data      = gradient_y
        self.view_tabs[ViewType.GradientYMask].data  = gradient_y_mask
        self.view_tabs[ViewType.CompositeMask].data  = combined_mask

    def calculate_meshes(self) -> None:
        """
        Updates the meshes.
        """

    def calculate(self) -> None:
        """ Update the UI with the representations of the DepthBuffer and Mesh."""
        self.calculate_images()
        self.calculate_meshes()
