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
#include "GaussianFilter.h"
#include "GaussianKernel.h"

namespace py = pybind11;
namespace ModelRelief{
PYBIND11_MODULE(relief, m)
{
    m.doc() = "ModelRelief image processing extensions";

    m.def("add_arrays", &add_arrays, "Add two NumPy arrays");
    m.def("fill", &fill, "Fill a NumPy array with a value");

    m.def("kernelTest", &kernelTest, "Gaussian kernel tests");

    py::class_<GaussianFilter>(m, "GaussianFilter")
        .def(py::init<NPDoubleArray&, NPDoubleArray&, double>());

    py::class_<GaussianKernel>(m, "GaussianKernel")
        .def(py::init<double>())
        .def("Element", &GaussianKernel::Element)
        .def("CalculateDefault", &GaussianKernel::CalculateDefault)
        .def("Normalize", &GaussianKernel::Normalize)
        .def("Display", &GaussianKernel::Display);
}
}