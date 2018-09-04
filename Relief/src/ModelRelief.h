/**
 * @brief ModelRelief Python C++ extensions.
 * 
 * @file ModelRelief.h
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once

#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>

namespace py = pybind11;

namespace ModelRelief {

//-------------------------------------------------------------------------------------------------//
//                                      Types                                                      //
//-------------------------------------------------------------------------------------------------//
using NPDoubleArray = py::array_t<double>;

//-------------------------------------------------------------------------------------------------//
//                                      Declarations                                               //
//-------------------------------------------------------------------------------------------------//
int add(int i, int j);
int subtract(int i, int j);

NPDoubleArray add_arrays(NPDoubleArray input1, NPDoubleArray input2);
NPDoubleArray fill(NPDoubleArray& input, double value);

void kernelTest();
}