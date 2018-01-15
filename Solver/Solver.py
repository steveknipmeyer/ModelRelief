#!/usr/bin/env python
#
#   Copyright (c) 2017
#   All Rights Reserved.
#

"""

.. module:: Solver
   :synopsis: Constructs a Mesh from a DepthBuffer and a MeshTransform.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os.path
import matplotlib.pylab as plt


def plot_image(image, height=8, **kwargs):
    """
    Helper function to plot an image.
    Dimensions are in centimeters.
    """
    y_length = image.shape[0]
    x_length = image.shape[1]
    aspect_ratio = y_length/x_length
    width = aspect_ratio * height
    print ('Aspect ratio = {}'.format(aspect_ratio))
    print ("w = {}, h = {}".format (width, height))

    plt.figure(figsize=(width, height))
    plt.imshow(image, interpolation="none", **kwargs)
    plt.axis('off')


def main():
    """
    Main entry point.
    """
    current_directory = os.path.dirname(__file__)
    file_name = os.path.join(current_directory, "Lucy.png")

    image = plt.imread(file_name)

    print(image.shape)

    plot_image(image, 5)

    plt.plot([1,2,3,4])
    plt.ylabel('some numbers')
    plt.show()

if __name__ == "__main__":

    main()
