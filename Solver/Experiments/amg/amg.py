import pyamg
import numpy as np

from mathtools import MathTools
from tools import Colors

def tutorial():
    A = pyamg.gallery.poisson((500,500), format='csr')  # 2D Poisson problem on 500x500 grid
    ml = pyamg.ruge_stuben_solver(A)                    # construct the multigrid hierarchy
    print(ml)                                           # print hierarchy information
    b = np.random.rand(A.shape[0])                      # pick a random right hand side
    x = ml.solve(b, tol=1e-10)                          # solve Ax=b to a tolerance of 1e-10
    print("residual: ", np.linalg.norm(b-A*x))          # compute norm of residual vector

def experiment():
    A = pyamg.gallery.poisson((4,4), format='csr')      # 2D Poisson problem on 4x4 grid
    MathTools.print_array('A-> A*F = Laplacian F', A.reshape(16, 16))

    ml = pyamg.ruge_stuben_solver(A)                    # construct the multigrid hierarchy
    # print(ml)                                           # print hierarchy information

    b = np.array([0,    0,    0, 0,
                  0, -150, -180, 0,
                  0, -120, -150, 0,
                  0,    0,    0, 0])
    MathTools.print_array('Divergence Gradient F', b.reshape(4, 4))

    x = ml.solve(b, tol=1e-10)                          # solve Ax=b to a tolerance of 1e-10

    u = np.reshape(x, [4, 4])
    MathTools.print_array ('F(x,y)', u)

    # print("residual: ", np.linalg.norm(b-A*x))          # compute norm of residual vector

experiment()
