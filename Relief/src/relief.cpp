// -----------------------------------------------------------------------
// <copyright file="relief.cpp" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>

#include "relief.h"

namespace py = pybind11;

int add(int i, int j)
{
    return i + j + 1000; 
}

int subtract(int i, int j)
{
    return i - j;
}

NPDoubleArray add_arrays(NPDoubleArray input1, NPDoubleArray input2)
{
   // read input arrays buffer_info
   py::buffer_info buf1 = input1.request(), buf2 = input2.request();
   if (buf1.size != buf2.size)
      throw std::runtime_error("Input shapes must match");

   // allocate the output buffer
   NPDoubleArray result = NPDoubleArray(buf1.size);
   py::buffer_info buf3 = result.request();
   double *ptr1 = (double *) buf1.ptr, *ptr2 = (double *) buf2.ptr, *ptr3 = (double *)buf3.ptr;
   size_t X = buf1.shape[0];
   size_t Y = buf1.shape[1];

   // Add both arrays
   for (size_t idx = 0; idx < X; idx++)
       for (size_t idy = 0; idy < Y; idy++)
           ptr3[idx*Y + idy] = ptr1[idx*Y+ idy] + ptr2[idx*Y+ idy];

   // reshape result to have same shape as input
   result.resize({X,Y});

   return result;
}

NPDoubleArray fill(NPDoubleArray& input, double value)
{
    // obtain buffer
    py::buffer_info buffer = input.request();

    // obtain raw pointer
    double *p = (double *)buffer.ptr;
    size_t numberRows     = buffer.shape[0];
    size_t numberColumns  = buffer.shape[1];

    // fill
    for (size_t indexRows = 0; indexRows < numberRows; indexRows++)
        for (size_t indexColumns = 0; indexColumns < numberColumns; indexColumns++)
            p[indexRows*numberColumns + indexColumns] = value;

    return input;
}
