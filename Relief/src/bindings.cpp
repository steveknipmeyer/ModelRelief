// -----------------------------------------------------------------------
// <copyright file="bindings.cpp" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
#include <pybind11/pybind11.h>
#include "relief.h"

namespace py = pybind11;

PYBIND11_MODULE(relief, m)
{
    m.doc() = "ModelRelief image processing extensions";

    // add: default values
    m.def("add", &add, "A function which adds two numbers", py::arg("i") = 1, py::arg("j") = 5);
    
    // subtract : no default values
    m.def("subtract", &subtract, "A function which subtracts two numbers");
}
