
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

from PyQt5 import QtCore, QtWidgets, QtGui 
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT as NavigationToolbar

import numpy as np      

class Explorer(QtWidgets.QMainWindow):
    """ https://stackoverflow.com/questions/42622146/scrollbar-on-matplotlib-showing-page """
    IMAGE_DIMENSIONS = 10

    def __init__(self, qapp : QtWidgets.QApplication) -> None:
        """Perform class initialization."""
        super().__init__()

        self.qapp = qapp
        self.setObjectName("ExplorerMainWindow")

        # https://www.blog.pythonlibrary.org/2015/08/18/getting-your-screen-resolution-with-python/
        screen_width = self.qapp.desktop().screenGeometry().width()               
        screen_height = self.qapp.desktop().screenGeometry().height()               
        factor = 0.9
        self.resize(factor * screen_width, factor * screen_height)

        self.widget = QtWidgets.QWidget()
        self.setCentralWidget(self.widget)
        self.widget.setLayout(QtWidgets.QVBoxLayout())
        self.widget.layout().setContentsMargins(0,0,0,0)
        self.widget.layout().setSpacing(0)

        # empty Figure
        self.fig = plt.figure(facecolor='black')
        self.canvas = FigureCanvas(self.fig)
        self.canvas.draw()

        self.nav = NavigationToolbar(self.canvas, self.widget)
        self.widget.layout().addWidget(self.nav)

        # Tau
        self.tau = QtWidgets.QLineEdit(self.widget)
        self.tau.setObjectName("tau")
        self.widget.layout().addWidget(self.tau)

        # Process Button
        self.button_process = QtWidgets.QPushButton(self.widget)
        self.button_process.setObjectName("button_process")
        self.widget.layout().addWidget(self.button_process)

        self.scroll = QtWidgets.QScrollArea(self.canvas)
        self.widget.layout().addWidget(self.scroll)

        self.retranslateUi(self)
        QtCore.QMetaObject.connectSlotsByName(self)

    def retranslateUi(self, window: QtWidgets.QMainWindow) -> None:
        """ Initialize the translatable test in the UI """
        _translate = QtCore.QCoreApplication.translate
        window.setWindowTitle(_translate("ExplorerMainWindow", "Explorer Window"))
        self.button_process.setText(_translate("ExplorerMainWindow", "Process"))

    def set_figure (self, figure: plt.Figure) -> None:
        """
        Set the given figure as the currently displayed Figure in the Explorer.
        Parameters
        ----------
        figure
            The Figure to make active.
        """
        #re-create canvas with new figure
        self.fig = figure
        self.canvas = FigureCanvas(figure)
        self.canvas.draw()

        # update associated controls
        self.scroll.setWidget(self.canvas)
        self.nav.canvas = self.canvas

    @staticmethod
    def construct_figure(images, rows = 1, titles = None, cmaps = None) -> plt.Figure:
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

        fig = plt.figure(facecolor='black')
        columns = np.ceil(n_images/float(rows))
        for n, (image, title, cmap) in enumerate(zip(images, titles, cmaps)):
            sub_plot = fig.add_subplot(rows, columns, n + 1)

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
            colorbar = fig.colorbar(plot, ax=sub_plot, drawedges=True)
            plt.setp(plt.getp(colorbar.ax.axes, 'yticklabels'), color='w')  # set colorbar  
                                                                            # yticklabels color            
            colorbar.outline.set_edgecolor('w')                             # set colorbar box color
            colorbar.outline.set_linewidth(2)            
            colorbar.ax.yaxis.set_tick_params(color='w')                    # set colorbar ticks color 
            colorbar.dividers.set_linewidth(0)            

        fig.set_size_inches(n_images * Explorer.IMAGE_DIMENSIONS, Explorer.IMAGE_DIMENSIONS)
        fig.tight_layout()

        return fig

    def show_window(self):
        self.show()
        