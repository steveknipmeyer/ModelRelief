
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

import numpy as np      

from solver import Solver
import explorer_ui

class Explorer():
    
    IMAGE_DIMENSIONS = 8
    SCREEN_AREA = 0.75

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
        self.initialize_ui()
        self.figure = plt.figure(facecolor='black')
        self.canvas = FigureCanvas(self.figure)

        # event handlers
        self.initialize_handlers()

    def initialize_ui(self)-> None:
        self.window = QtWidgets.QMainWindow()
        self.ui = explorer_ui.Ui_MainWindow()
        self.ui.setupUi(self.window)
        
        self.ui.centralwidget.layout().setContentsMargins(0,0,0,0)
        self.ui.centralwidget.layout().setSpacing(0)

        # empty Figure
        self.figure = plt.figure(facecolor='black')
        self.canvas = FigureCanvas(self.figure)
        self.canvas.draw()

        self.nav = NavigationToolbar(self.canvas, self.ui.centralwidget)
        self.ui.centralwidget.layout().addWidget(self.nav)

        # https://stackoverflow.com/questions/42622146/scrollbar-on-matplotlib-showing-page
        self.scroll = QtWidgets.QScrollArea(self.canvas)
        self.ui.centralwidget.layout().addWidget(self.scroll)

        # https://www.blog.pythonlibrary.org/2015/08/18/getting-your-screen-resolution-with-python/
        screen_width = self.qapp.desktop().screenGeometry().width()               
        screen_height = self.qapp.desktop().screenGeometry().height()               
        self.window.resize(Explorer.SCREEN_AREA * screen_width, Explorer.SCREEN_AREA * screen_height)

        #intialize settings
        self.initialize_settings()
    
    def initialize_settings(self) ->None:
        self.ui.text_tau.setText(str(self.solver.mesh_transform.tau))

    def initialize_handlers(self)-> None:
        """ Initialize event handlers """
        self.ui.button_process.clicked.connect(self.handle_process)

    def handle_process(self):
        """
        Recalculates the image set.
        """ 
        self.solver.mesh_transform.tau = float(self.ui.text_tau.text())
        self.update_figure()

    def show(self):
        """ Show the MainWindow. """
        self.window.show()

    def set_figure (self, figure: plt.Figure) -> None:
        """
        Set the given figure as the currently displayed Figure in the Explorer.
        Parameters
        ----------
        figure
            The Figure to make active.
        """
        #re-create canvas with new figure
        self.figure = figure
        self.canvas = FigureCanvas(figure)
        self.canvas.draw()

        # update associated controls
        self.scroll.setWidget(self.canvas)
        self.nav.canvas = self.canvas

    def construct_figure(self, images, rows = 1, titles = None, cmaps = None) -> plt.Figure:
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

    def calculate_figure(self) -> plt.Figure:
        """
        Updates the Figure consisting of the image set and legends.
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

        images = [depth_buffer, depth_buffer_mask, gradient_x, gradient_x_mask, gradient_y, gradient_y_mask, combined_mask]
        titles = ["DepthBuffer", "Background Mask", "Gradient X: dI(x,y)/dx", "Gradient X Mask", "Gradient Y: dI(x,y)/dy", "Gradient Y Mask", "Composite Mask"]
        cmaps  = ["gray", "gray", "Blues_r", "gray", "Blues_r", "gray", "gray"]
        rows = 1

        return self.construct_figure(images, rows, titles, cmaps)

    def update_figure(self):
        """ Update the image set figure. """
        figure = self.calculate_figure()
        self.set_figure(figure)
        self.show()


