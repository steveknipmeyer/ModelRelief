#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#
"""
.. module:: relieftest
   :synopsis: C++ extensions for Python image processing.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import pyamg
import numpy as np

import os
import sys
import relief

def tutorial():
    A = pyamg.gallery.poisson((500,500), format='csr')  # 2D Poisson problem on 500x500 grid
    ml = pyamg.ruge_stuben_solver(A)                    # construct the multigrid hierarchy
    print(ml)                                           # print hierarchy information
    b = np.random.rand(A.shape[0])                      # pick a random right hand side
    x = ml.solve(b, tol=1e-10)                          # solve Ax=b to a tolerance of 1e-10
    print("residual: ", np.linalg.norm(b-A*x))          # compute norm of residual vector


tutorial() 

result = relief.add(1, 1)
print (result)

