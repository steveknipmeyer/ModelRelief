#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: Results
   :synopsis: The collection of solver results (images, meshes, workbench).

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import numpy as np

class Results:
    """
    Holds the results of the Solver solution including the intermediate values.
    """
    def __init__(self)-> None:
        """
        Initialization
        N.B. PyLint warns on instance members initialized outsize __init__ so properties are initialized twice.
        """
        default_shape = (1, 1)
        # component images
        self.depth_buffer_model: ImageResult = ImageResult(np.zeros(default_shape), "")                       # DepthBuffer : Z coordinates in model units
        self.depth_buffer_mask: ImageResult = ImageResult(np.zeros(default_shape), "")                        # DepthBuffer : background bit mask of complete model
        self.dGxdx: ImageResult = ImageResult(np.zeros(default_shape), "")                                    # 1st derivative of Gradient wrt X: dGradientX(x,y) / dx
        self.dGydy: ImageResult = ImageResult(np.zeros(default_shape), "")                                    # 1st derivative of Gradient wrt Y: dGradientY(x,y) / dy
        self.divG: ImageResult = ImageResult(np.zeros(default_shape), "")                                     # div Gradient(x,y)
        self.gradient_x: ImageResult = ImageResult(np.zeros(default_shape), "")                               # GradientX (thresholded)
        self.gradient_x_mask: ImageResult = ImageResult(np.zeros(default_shape), "")                          # GradientY (thresholded)
        self.gradient_y: ImageResult = ImageResult(np.zeros(default_shape), "")                               # GradientX bit mask (thresholded)
        self.gradient_y_mask: ImageResult = ImageResult(np.zeros(default_shape), "")                          # GradientX bit mask (thresholded)
        self.combined_mask: ImageResult = ImageResult(np.zeros(default_shape), "")                            # final bit mask : compostite
        self.gradient_x_unsharp: ImageResult = ImageResult(np.zeros(default_shape), "")                       # GradientX : (unsharp masked)
        self.gradient_y_unsharp: ImageResult = ImageResult(np.zeros(default_shape), "")                       # GradientY : (unsharp masked)

        # mesh results
        self.mesh_scaled: ImageResult = ImageResult(np.zeros(default_shape), "")                              # Mesh: scaled linearly
        self.mesh_transformed: ImageResult = ImageResult(np.zeros(default_shape), "")                         # Mesh: complete solution

        # workbench images
        self.i1: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i2: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i3: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i4: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i5: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i6: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i7: ImageResult = ImageResult(np.zeros(default_shape), "")
        self.i8: ImageResult = ImageResult(np.zeros(default_shape), "")

    def initialize(self, rows: int, columns: int)->None :
        """
        Initialize all result values.
        Parameters
        ----------
        rows
            The number of rows (pixels) in the result arrays.
        columns
            The number of columns (pixels) in the result arrays.
        """
        initialization_shape = (rows, columns)

        # component images
        self.depth_buffer_model = ImageResult(np.zeros(initialization_shape), "Model")
        self.depth_buffer_mask = ImageResult(np.zeros(initialization_shape), "Background Mask")
        self.dGxdx = ImageResult(np.zeros(initialization_shape), "div Gx: dG(x,y)/dx")
        self.dGydy = ImageResult(np.zeros(initialization_shape), "div Gy: dG(x,y)/dy")
        self.divG = ImageResult(np.zeros(initialization_shape), "div G")
        self.gradient_x = ImageResult(np.zeros(initialization_shape), "Gradient X: dI(x,y)/dx")
        self.gradient_x_mask = ImageResult(np.zeros(initialization_shape), "Gradient X Mask")
        self.gradient_y = ImageResult(np.zeros(initialization_shape), "Gradient Y: dI(x,y)/dy")
        self.gradient_y_mask = ImageResult(np.zeros(initialization_shape), "Gradient Y Mask")
        self.combined_mask = ImageResult(np.zeros(initialization_shape), "Composite Mask")
        self.gradient_x_unsharp = ImageResult(np.zeros(initialization_shape), "Gradient X Unsharp")
        self.gradient_y_unsharp = ImageResult(np.zeros(initialization_shape), "Gradient Y Unsharp")

        # mesh results
        self.mesh_scaled: np.ndarray = ImageResult(np.zeros(initialization_shape), "Model Scaled")
        self.mesh_transformed: np.ndarray = ImageResult(np.zeros(initialization_shape), "Relief")

        # workbench images
        self.i1 = ImageResult(np.zeros(initialization_shape), "I1")
        self.i2 = ImageResult(np.zeros(initialization_shape), "I2")
        self.i3 = ImageResult(np.zeros(initialization_shape), "I3")
        self.i4 = ImageResult(np.zeros(initialization_shape), "I4")
        self.i5 = ImageResult(np.zeros(initialization_shape), "I5")
        self.i6 = ImageResult(np.zeros(initialization_shape), "I6")
        self.i7 = ImageResult(np.zeros(initialization_shape), "I7")
        self.i8 = ImageResult(np.zeros(initialization_shape), "I8")

class ImageResult:
    """
    Represents a tab holding a Workbench image and a title.
    """
    def __init__(self, image: np.ndarray, title: str)-> None:
        """
        Constructor.
        Parameters
        ----------
        image
            Image data.
        title
            Image title.
        """
        self.image = image
        self.title = title

class DataSource:
    """
    Represents a source of data for an Explorer UI content element.
    """
    def __init__(self, results: Results, property_name: str)-> None:
        """
        Constructor.
        Parameters
        ----------
        results
            The Results structure holding the Solver results.
        property
            The property name of the source in Results
        """
        self.results = results
        self.property = property_name
        self.dirty = True

    @property
    def data(self)-> ImageResult:
        """
        Returns the source data from the Results structure.
        """
        return self.results.__getattribute__(self.property)


