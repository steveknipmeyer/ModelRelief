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
NPDoubleArray add_arrays(NPDoubleArray input1, NPDoubleArray input2);
NPDoubleArray& fill(NPDoubleArray& input, double value);
NPDoubleArray gaussian_filter(NPDoubleArray &image, double sigma, NPDoubleArray &mask, int algorithm);

int kernelTest();
}