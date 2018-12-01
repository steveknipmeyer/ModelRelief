#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: pngfloat
   :synopsis: Experiments in Python.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>

"""
import os
import sys
import numpy as np
import numpngw

from filemanager import FileManager

def main():

    nrows = 512
    ncols = 512

    path = "D:/ModelRelief/ModelRelief/store/development/users/auth05bedab58aa237e078600530b/depthbuffers/10/test.sdb"
    byte_list = FileManager().read__binary( path)
    x = FileManager().unpack_floats(byte_list)
    x = np.reshape(x, [nrows, ncols])

    # Convert to 16 bit unsigned integers.
    z = (65535*((x - x.min())/x.ptp())).astype(np.uint16)

    z = np.flipud(z)

    # Use numpngw to write zgray as a grayscale PNG.
    numpngw.write_png('test.png', z)

if __name__ == '__main__':
    main()


