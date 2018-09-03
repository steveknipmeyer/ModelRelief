/**
 * @brief pybind11 bindings for ModelRelief Python extensions.
 * 
 * @file Bindings.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once

#include <pybind11/pybind11.h>
#include "ModelRelief.h"

namespace py = pybind11;
namespace ModelRelief{
PYBIND11_MODULE(relief, m)
{
    m.doc() = "ModelRelief image processing extensions";

    // add: default values
    m.def("add", &add, "A function which adds two numbers", py::arg("i") = 1, py::arg("j") = 5);
    
    // subtract : no default values
    m.def("subtract", &subtract, "A function which subtracts two numbers");

    m.def("add_arrays", &add_arrays, "Add two NumPy arrays");
    m.def("fill", &fill, "Fill a NumPy array with a value");

    m.def("kernel", &kernel, "Gaussian filter tests");
}
}