
#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: viewer
   :synopsis: Experiments in image display of depth buffers.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import matplotlib
matplotlib.use('Qt5Agg')
import matplotlib.pyplot as plt

from PyQt5 import QtWidgets 
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT as NavigationToolbar

import numpy as np

class Viewer:
    """
    Displays a depth buffer as an image.
    """
    def __init__(self):
        """
        Initialize an instance of the Viewer.
        """
        
    def show_image(self, array, color_map: str, title: str):
        """
        Display a buffer of floats as an image.

        Parameters
        ----------
        array
            A Numpy 2D array.
        color_map
            A matplot lib colop map identifier (e.g. 'gray', 'rainbow')
        title 
            The title of the image.       
        """

        # flip; first DB row is at minimum Y
        array = np.flipud(array)
        
        # setup
        plt.figure(figsize=(10, 10))
        plt.title(title)
        plt.imshow(array, cmap=color_map)

        # make visible
        plt.show()

    def show_images(self, images, rows = 1, titles = None, cmaps = None):
        """Display a list of images in a single figure with matplotlib.
        https://gist.github.com/soply/f3eec2e79c165e39c9d540e916142ae1
        
        Parameters
        ---------
        images: List of np.arrays compatible with plt.imshow.
        
        rows (Default = 1): Number of rows in figure (number of columns is set to np.ceil(n_images/float(rows))).
        
        titles: List of titles corresponding to each image. Must have the same length as images.

        cmaps: List of color maps corresponding to each image. Must have the same length as images.
        """
        assert((titles is None) or (len(images) == len(titles)))
        n_images = len(images)
        if titles is None: titles = ['Image (%d)' % i for i in range(1, n_images + 1)]
        fig = plt.figure()

        columns = np.ceil(n_images/float(rows))
        for n, (image, title, cmap) in enumerate(zip(images, titles, cmaps)):
            sub_plot = fig.add_subplot(rows, columns, n + 1)

            # flip; first row is at minimum Y
            image = np.flipud(image)

            plot = plt.imshow(image, cmap)
            sub_plot.set_title(title)

            # colorbar legend
            # https://matplotlib.org/examples/images_contours_and_fields/pcolormesh_levels.html
            fig.colorbar(plot, ax=sub_plot)

        image_dimension = 10
        fig.set_size_inches(n_images * image_dimension , image_dimension)       
        fig.tight_layout()

        window = ScrollableWindow(fig)        
        window.show_window()
        #plt.show()

class ScrollableWindow(QtWidgets.QMainWindow):
    """ https://stackoverflow.com/questions/42622146/scrollbar-on-matplotlib-showing-page """

    def __init__(self, fig):
        """Perform class initialization."""
        QtWidgets.QMainWindow.__init__(self)

        self.qapp = QtWidgets.QApplication([])

        # https://www.blog.pythonlibrary.org/2015/08/18/getting-your-screen-resolution-with-python/
        screen_width = self.qapp.desktop().screenGeometry().width()               
        screen_height = self.qapp.desktop().screenGeometry().height()               
        factor = 0.9
        self.setFixedSize(factor * screen_width, factor * screen_height)

        self.widget = QtWidgets.QWidget()
        self.setCentralWidget(self.widget)
        self.widget.setLayout(QtWidgets.QVBoxLayout())
        self.widget.layout().setContentsMargins(0,0,0,0)
        self.widget.layout().setSpacing(0)

        self.fig = fig
        self.canvas = FigureCanvas(self.fig)
        self.canvas.draw()
        self.scroll = QtWidgets.QScrollArea(self.widget)
        self.scroll.setWidget(self.canvas)

        self.nav = NavigationToolbar(self.canvas, self.widget)
        self.widget.layout().addWidget(self.nav)
        self.widget.layout().addWidget(self.scroll)

    def show_window(self):
        """Show the window."""        
        self.show()
        exit(self.qapp.exec_()) 
