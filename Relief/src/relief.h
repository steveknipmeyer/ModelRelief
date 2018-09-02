// -----------------------------------------------------------------------
// <copyright file="relief.h" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>

namespace py = pybind11;

typedef py::array_t<double>NPDoubleArray;

/*! Add two integers
    \param i an integer
    \param j another integer
*/
int add(int i, int j);

/*! Subtract one integer from another 
    \param i an integer
    \param j an integer to subtract from \p i
*/
int subtract(int i, int j);

NPDoubleArray add_arrays(NPDoubleArray input1, NPDoubleArray input2);
NPDoubleArray fill(NPDoubleArray& input, double value);