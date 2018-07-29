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
    def __init__(self):
        # component images
        self.depth_buffer_model: np.ndarray = None                      # DepthBuffer : Z coordinates in model units
        self.depth_buffer_mask: np.ndarray = None                       # DepthBuffer : background bit mask of complete model
        self.dGxdx: np.ndarray = None                                   # 1st derivative of Gradient wrt X: dGradientX(x,y) / dx
        self.dGydy: np.ndarray = None                                   # 1st derivative of Gradient wrt Y: dGradientY(x,y) / dy
        self.divG: np.ndarray = None                                    # div Gradient(x,y)
        self.gradient_x: np.ndarray = None                              # GradientX (thresholded)
        self.gradient_x_mask: np.ndarray = None                         # GradientY (thresholded)
        self.gradient_y: np.ndarray = None                              # GradientX bit mask (thresholded)
        self.gradient_y_mask: np.ndarray = None                         # GradientX bit mask (thresholded)
        self.combined_mask: np.ndarray = None                           # final bit mask : compostite 
        self.gradient_x_unsharp: np.ndarray = None                      # GradientX : (unsharp masked)
        self.gradient_y_unsharp: np.ndarray = None                      # GradientY : (unsharp masked)

        # mesh results
        self.mesh_scaled: np.ndarray = None                             # Mesh: scaled linearly
        self.mesh_transformed: np.ndarray = None                        # Mesh: complete solution

        # workbench images
        default_workbench_image_dimensions = 512
        self.i1 = np.zeros((default_workbench_image_dimensions, default_workbench_image_dimensions))
        self.i2 = np.zeros((default_workbench_image_dimensions, default_workbench_image_dimensions))
        self.i3 = np.zeros((default_workbench_image_dimensions, default_workbench_image_dimensions))
        self.i4 = np.zeros((default_workbench_image_dimensions, default_workbench_image_dimensions))
        self.i5 = np.zeros((default_workbench_image_dimensions, default_workbench_image_dimensions))
        self.i6 = np.zeros((default_workbench_image_dimensions, default_workbench_image_dimensions))
