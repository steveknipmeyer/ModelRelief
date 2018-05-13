
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

import matplotlib.pyplot as plt
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
        fig = plt.figure(figsize=(15, 4))

        columns = np.ceil(n_images/float(rows))
        for n, (image, title, cmap) in enumerate(zip(images, titles, cmaps)):
            sub_plot = fig.add_subplot(rows, columns, n + 1)

            # flip; first row is at minimum Y
            image = np.flipud(image)

            plt.imshow(image, cmap)
            sub_plot.set_title(title)

        #fig.set_size_inches(np.array(fig.get_size_inches()) * n_images)
        plt.show()