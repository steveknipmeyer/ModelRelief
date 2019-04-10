/**
 * @brief pybind11 bindings for ModelRelief Python extensions.
 *
 * @file Bindings.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
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

    m.def("gaussian_filter", &gaussian_filter, "Peform a Gaussian filter on an image");
    m.def("kernelTest", &kernelTest, "Gaussian kernel test");

    // These bindings should be removed as it is problematic to hold a NumPy reference in a C++ instance across Python calls.
    // The pybind11 references are valid for only the lifetime of the Python call.
    py::class_<GaussianFilter>(m, "GaussianFilter")
        .def(py::init<NPDoubleArray&, NPDoubleArray&, double>())
        .def("Calculate", &GaussianFilter::Calculate);

    py::class_<GaussianKernel>(m, "GaussianKernel")
        .def(py::init<double>())
        .def("Element", &GaussianKernel::Element)
        .def("CalculateDefault", &GaussianKernel::CalculateStandard)
        .def("Normalize", &GaussianKernel::Normalize)
        .def("Display", &GaussianKernel::Display);
}
}