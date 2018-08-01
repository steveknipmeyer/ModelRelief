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
        self.depth_buffer_model: np.ndarray = np.zeros(default_shape)                       # DepthBuffer : Z coordinates in model units
        self.depth_buffer_mask: np.ndarray = np.zeros(default_shape)                        # DepthBuffer : background bit mask of complete model
        self.dGxdx: np.ndarray = np.zeros(default_shape)                                    # 1st derivative of Gradient wrt X: dGradientX(x,y) / dx
        self.dGydy: np.ndarray = np.zeros(default_shape)                                    # 1st derivative of Gradient wrt Y: dGradientY(x,y) / dy
        self.divG: np.ndarray = np.zeros(default_shape)                                     # div Gradient(x,y)
        self.gradient_x: np.ndarray = np.zeros(default_shape)                               # GradientX (thresholded)
        self.gradient_x_mask: np.ndarray = np.zeros(default_shape)                          # GradientY (thresholded)
        self.gradient_y: np.ndarray = np.zeros(default_shape)                               # GradientX bit mask (thresholded)
        self.gradient_y_mask: np.ndarray = np.zeros(default_shape)                          # GradientX bit mask (thresholded)
        self.combined_mask: np.ndarray = np.zeros(default_shape)                            # final bit mask : compostite 
        self.gradient_x_unsharp: np.ndarray = np.zeros(default_shape)                       # GradientX : (unsharp masked)
        self.gradient_y_unsharp: np.ndarray = np.zeros(default_shape)                       # GradientY : (unsharp masked)

        # mesh results
        self.mesh_scaled: np.ndarray = np.zeros(default_shape)                              # Mesh: scaled linearly
        self.mesh_transformed: np.ndarray = np.zeros(default_shape)                         # Mesh: complete solution

        # workbench images
        self.i1 = np.zeros(default_shape)
        self.i2 = np.zeros(default_shape)
        self.i3 = np.zeros(default_shape)
        self.i4 = np.zeros(default_shape)
        self.i5 = np.zeros(default_shape)
        self.i6 = np.zeros(default_shape)

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
        self.depth_buffer_model: np.ndarray = np.zeros(initialization_shape)
        self.depth_buffer_mask: np.ndarray = np.zeros(initialization_shape) 
        self.dGxdx: np.ndarray = np.zeros(initialization_shape)             
        self.dGydy: np.ndarray = np.zeros(initialization_shape)             
        self.divG: np.ndarray = np.zeros(initialization_shape)              
        self.gradient_x: np.ndarray = np.zeros(initialization_shape)        
        self.gradient_x_mask: np.ndarray = np.zeros(initialization_shape)   
        self.gradient_y: np.ndarray = np.zeros(initialization_shape)        
        self.gradient_y_mask: np.ndarray = np.zeros(initialization_shape)   
        self.combined_mask: np.ndarray = np.zeros(initialization_shape)     
        self.gradient_x_unsharp: np.ndarray = np.zeros(initialization_shape)
        self.gradient_y_unsharp: np.ndarray = np.zeros(initialization_shape)

        # mesh results
        self.mesh_scaled: np.ndarray = np.zeros(initialization_shape)       
        self.mesh_transformed: np.ndarray = np.zeros(initialization_shape)  

        # workbench images
        self.i1 = np.zeros(initialization_shape)
        self.i2 = np.zeros(initialization_shape)
        self.i3 = np.zeros(initialization_shape)
        self.i4 = np.zeros(initialization_shape)
        self.i5 = np.zeros(initialization_shape)
        self.i6 = np.zeros(initialization_shape)

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
    def data(self)-> np.ndarray:
        """
        Returns the source data from the Results structure.
        """
        return self.results.__getattribute__(self.property)


