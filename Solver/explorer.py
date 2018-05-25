
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

import numpy as np      

class Explorer(QtWidgets.QMainWindow):
    """ https://stackoverflow.com/questions/42622146/scrollbar-on-matplotlib-showing-page """
    IMAGE_DIMENSIONS = 10

    def __init__(self, qapp : QtWidgets.QApplication) -> None:
        """Perform class initialization."""
        QtWidgets.QMainWindow.__init__(self)

        self.qapp = qapp

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

        # empty Figure
        self.fig = plt.figure()
        self.canvas = FigureCanvas(self.fig)
        self.canvas.draw()

        self.scroll = QtWidgets.QScrollArea(self.widget)
        self.nav = NavigationToolbar(self.canvas, self.widget)

        self.widget.layout().addWidget(self.scroll)
        self.widget.layout().addWidget(self.nav)

    def set_figure (self, figure: plt.Figure) -> None:
        """
        Set the given figure as the currently displayed Figure in the Explorer.
        Parameters
        ----------
        figure
            The Figure to make active.
        """

        self.fig = figure
        self.canvas = FigureCanvas(figure)
        self.canvas.draw()
        self.scroll.setWidget(self.canvas)

    @staticmethod
    def construct_figure(images, rows = 1, titles = None, cmaps = None) -> plt.Figure:
        """Display a list of images in a single figure with matplotlib.
        https://gist.github.com/soply/f3eec2e79c165e39c9d540e916142ae1
        
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

        fig.set_size_inches(n_images * Explorer.IMAGE_DIMENSIONS, Explorer.IMAGE_DIMENSIONS)
        fig.tight_layout()

        return fig

    def show_window(self):
        self.show()
        