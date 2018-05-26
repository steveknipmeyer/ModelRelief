#!/usr/bin/env python3
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

import numpy as np
from enum import Enum
from typing import Dict

from solver import Solver
import explorer_ui

class ImageType(Enum):
    """
    A class representing the various image tabs.
    """
    DepthBuffer = 1,
    BackgroundMask = 2,
    GradientX = 3,
    GradientXMask = 4,
    GradientY = 5,
    GradientYMask = 6,
    CompositeMask = 7

class ImageTab():
    """ A UI tab of an image"""

    def __init__(self, widget: QtWidgets.QWidget, image_type: ImageType, title:str, cmap: str, image: np.ndarray) -> None:
        """ A UI image tab in the Explorer. 
        Parameters
        ----------
        widget
            QWidget of the tab.
        image_type
            The type of the image.
        title
            The title of the image.
        cmap
            The matplotlib colormap.            
        image
            The Numpy array holding the image. 
        """
        # QWidget
        self.widget = widget

        self.image_type = image_type 
        self.title = title
        self.cmap = cmap

        self.figure: Figure = None
        self.canvas: FigureCanvas = None
        self.scroll: QtWidgets.QScrollArea = None
        self.nav: NavigationToolbar = None

        self._image = None
        self.image = image

    @property
    def image(self):
        """ Returns the Numpy image array. """
        return self._image

    @image.setter
    def image (self, value): 
        """ Sets the NumPy image array.
            Regenerates the matplotlib Figure.
        """
        self._image = value

        if (self.figure != None):
            plt.close(self.figure)
        # self.figure = self.construct_figure(self._image, self.title, self.cmap)
        self.figure = self.construct_subplot_figures ([self._image], 1, [self.title], [self.cmap])

        self.canvas = FigureCanvas(self.figure)
        self.canvas.draw()

        # navigation toolbar
        if (self.nav == None):
            self.nav = NavigationToolbar(self.canvas, self.widget)
            self.widget.layout().addWidget(self.nav)

        # scroll area
        if (self.scroll == None):
            self.scroll = QtWidgets.QScrollArea(self.canvas)
            self.widget.layout().addWidget(self.scroll)

        # update associated controls
        self.scroll.setWidget(self.canvas)
        self.nav.canvas = self.canvas

    def construct_figure(self, image: np.ndarray, title: str, cmap: str) -> plt.Figure:
        """ Contruct a matplotlib Figure from a NumPy image array.

        Parameters
        ---------
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
        figure = plt.figure(facecolor='black')

        # flip; first row is at minimum Y
        image = np.flipud(image)
        plot = plt.imshow(image, cmap)

        # title
        title_obj = plt.title(title)
        plt.setp(title_obj, color='w')                         # set the color of title to white

        # axes
        axes_obj = plt.getp(plot,'axes')                       # get the axes' property handler
        plt.setp(plt.getp(axes_obj, 'yticklabels'), color='w') # set yticklabels color
        plt.setp(plt.getp(axes_obj, 'xticklabels'), color='w') # set xticklabels color

        # colorbar
        # https://matplotlib.org/examples/images_contours_and_fields/pcolormesh_levels.html
        colorbar = figure.colorbar(plot, drawedges=True)
        plt.setp(plt.getp(colorbar.ax.axes, 'yticklabels'), color='w')  # set colorbar
                                                                        # yticklabels color
        colorbar.outline.set_edgecolor('w')                             # set colorbar box color
        colorbar.outline.set_linewidth(2)
        colorbar.ax.yaxis.set_tick_params(color='w')                    # set colorbar ticks color
        colorbar.dividers.set_linewidth(0)

        figure.set_size_inches(Explorer.IMAGE_DIMENSIONS, Explorer.IMAGE_DIMENSIONS)
        figure.tight_layout()

        return figure

    def construct_subplot_figures(self, images, rows, titles = None, cmaps = None) -> plt.Figure:
        """Display a list of images in a single figure with matplotlib.
        https://gist.github.com/soply/f3eec2e79c165e39c9d540e916142ae1
        https://stackoverflow.com/questions/9662995/matplotlib-change-title-and-colorbar-text-and-tick-colors

        Parameters
        ---------
        images: List of np.arrays compatible with plt.imshow.

        rows (Default = 1): Number of rows in figure (number of columns is set to np.ceil(n_images/float(rows))).

        titles: List of titles corresponding to each image. Must have the same length as images.

        cmaps: List of color maps corresponding to each image. Must have the same length as images.

        Returns
        -------
        A Figure.
        """
        assert((titles is None) or (len(images) == len(titles)))
        n_images = len(images)
        if titles is None: titles = ['Image (%d)' % i for i in range(1, n_images + 1)]

        figure = plt.figure(facecolor='black')
        columns = np.ceil(n_images/float(rows))
        for n, (image, title, cmap) in enumerate(zip(images, titles, cmaps)):
            sub_plot = figure.add_subplot(rows, columns, n + 1)

            # flip; first row is at minimum Y
            image = np.flipud(image)
            plot = plt.imshow(image, cmap)

            # title
            title_obj = sub_plot.set_title(title)
            plt.setp(title_obj, color='w')                         # set the color of title to white

            # axes
            axes_obj = plt.getp(sub_plot,'axes')                   # get the axes' property handler
            plt.setp(plt.getp(axes_obj, 'yticklabels'), color='w') # set yticklabels color
            plt.setp(plt.getp(axes_obj, 'xticklabels'), color='w') # set xticklabels color

            # colorbar
            # https://matplotlib.org/examples/images_contours_and_fields/pcolormesh_levels.html
            colorbar = figure.colorbar(plot, ax=sub_plot, drawedges=True)
            plt.setp(plt.getp(colorbar.ax.axes, 'yticklabels'), color='w')  # set colorbar
                                                                            # yticklabels color
            colorbar.outline.set_edgecolor('w')                             # set colorbar box color
            colorbar.outline.set_linewidth(2)
            colorbar.ax.yaxis.set_tick_params(color='w')                    # set colorbar ticks color
            colorbar.dividers.set_linewidth(0)

        figure.set_size_inches(n_images * Explorer.IMAGE_DIMENSIONS, Explorer.IMAGE_DIMENSIONS)
        figure.tight_layout()

        return figure

class Explorer():

    IMAGE_DIMENSIONS = 8
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

        self.solver = Solver(settings, working)

        self.qapp = qapp

        # initialize UI
        self.image_tabs: Dict[ImageType, ImageTab] = {}
        self.initialize_ui()
     
        # event handlers
        self.initialize_handlers()

    def initialize_ui(self)-> None:
        self.window = QtWidgets.QMainWindow()
        self.ui = explorer_ui.Ui_MainWindow() 
        self.ui.setupUi(self.window)

        default_image = np.zeros(shape=(2,2))
        self.image_tabs[ImageType.DepthBuffer]    = ImageTab(self.ui.depthBufferTab, ImageType.DepthBuffer, "DepthBuffer", "gray", default_image)
        self.image_tabs[ImageType.BackgroundMask] = ImageTab(self.ui.backgroundMaskTab, ImageType.BackgroundMask, "Background Mask", "gray", default_image)
        self.image_tabs[ImageType.GradientX]      = ImageTab(self.ui.gradientXTab, ImageType.GradientX, "Gradient X: dI(x,y)/dx", "Blues_r", default_image)
        self.image_tabs[ImageType.GradientXMask]  = ImageTab(self.ui.gradientXMaskTab, ImageType.GradientXMask, "Gradient X Mask", "gray", default_image)
        self.image_tabs[ImageType.GradientY]      = ImageTab(self.ui.gradientYTab, ImageType.GradientY, "Gradient Y: dI(x,y)/dy", "Blues_r", default_image)
        self.image_tabs[ImageType.GradientYMask]  = ImageTab(self.ui.gradientYMaskTab, ImageType.GradientYMask, "Gradient Y Mask", "gray", default_image)
        self.image_tabs[ImageType.CompositeMask]  = ImageTab(self.ui.compositeMaskTab, ImageType.CompositeMask, "Composite Mask", "gray", default_image)

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

    def handle_process(self):
        """
        Recalculates the image set.
        """
        self.solver.mesh_transform.tau = float(self.ui.tauLineEdit.text())
        self.calculate_images()
        self.show()

    def show(self):
        """ Show the MainWindow. """
        self.window.show()

    def calculate_images(self) -> None:
        """
        Updates the image arrays : DepthBuffer and the supporting gradients and masks.
        """
        depth_buffer = self.solver.depth_buffer.floats
        depth_buffer_mask = self.solver.depth_buffer.background_mask

        gradient_x = self.solver.depth_buffer.gradient_x
        gradient_y = self.solver.depth_buffer.gradient_y

        threshold = self.solver.mesh_transform.tau
        gradient_x_mask = self.solver.mask.mask_threshold(gradient_x, threshold)
        gradient_y_mask = self.solver.mask.mask_threshold(gradient_y, threshold)

        gradient_x = self.solver.threshold.apply(gradient_x, threshold)
        gradient_y = self.solver.threshold.apply(gradient_y, threshold)

        combined_mask = depth_buffer_mask * gradient_x_mask * gradient_y_mask

        self.image_tabs[ImageType.DepthBuffer].image    = depth_buffer
        self.image_tabs[ImageType.BackgroundMask].image = depth_buffer_mask
        self.image_tabs[ImageType.GradientX].image      = gradient_x
        self.image_tabs[ImageType.GradientXMask].image  = gradient_x_mask
        self.image_tabs[ImageType.GradientY].image      = gradient_y
        self.image_tabs[ImageType.GradientYMask].image  = gradient_y_mask
        self.image_tabs[ImageType.CompositeMask].image  = combined_mask

