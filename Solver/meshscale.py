#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
import math
import time

from typing import List, Tuple

from depthbuffer import DepthBuffer

"""
.. module:: MeshScale
   :synopsis: Support for scaling meshes.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""

class MeshScale: 
    """
    A class for scaling meshes.
    """

    def __init__(self, working_folder):
        """
        Initialize an instance of a MeshScale.
        """
        self.debug = True
        self.working_folder = working_folder

    def scale_buffer(self, buffer: DepthBuffer, scale: float) -> List[float]:
        """
        Transforms a DepthBuffer by a MeshTransform
        """
        # scale
        start_time = time.time()
        scaled_floats = buffer.scale_floats (scale)
        print ("scale_buffer = %s" % (time.time() - start_time))

        if self.debug:
            # write original floats
            unscaled_path = '%s/%s.floats.%f' % (self.working_folder, buffer.name, 1.0)
            buffer.write_floats(unscaled_path, buffer.floats_raw)

            # write transformed floats
            scaled_path = '%s/%s.floatsPrime.%f' % (self.working_folder, buffer.name, scale)
            buffer.write_floats(scaled_path, scaled_floats)

            self.verify_scale_buffer((unscaled_path, scaled_path), buffer, scale)

        return scaled_floats

    def verify_scale_buffer(self, files : Tuple[str, str], buffer: DepthBuffer, scale : float) -> None:
        """
        Compares the baseline floats with the scaled floats.

        Parameters:
        ----------
        files : tuple
            A tuple of the original, unscaled float file and the scaled float file.
        buffer : DepthBuffer
            The DepthBuffer that has been scaled.
        scale : float
            The scale factor applied to the depths.
        """

        unscaled_path, scaled_path = files
        print ("Unscaled : %s" % unscaled_path)
        print ("Scaled : %s" % scaled_path)

        unscaled = buffer.read_floats(unscaled_path)
        scaled   = buffer.read_floats(scaled_path)

        tolerance = 1e-6
        for index in range(0, len(unscaled)):
            try:    
                unscaled_value = buffer.normalized_to_model_depth(unscaled[index])
                scaled_value   = buffer.normalized_to_model_depth(scaled[index])

                equal = math.isclose(unscaled_value * scale, scaled_value, abs_tol=tolerance)
                if not equal:
                    print ("Values differ: %f != %f at index %d" % (unscaled_value, scaled_value, index))
                    break
            except Exception:
                print ("An exception occurred validating the scaled DepthBuffer.")     
                break
        print ("Scale verified.")
