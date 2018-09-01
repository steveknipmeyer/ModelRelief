cmake_minimum_required(VERSION 3.11.0)
project(relief)

# source directory
set(SOURCE_DIR "src")

# headers are also in SOURCE_DIR
include_directories(${SOURCE_DIR})

set(SOURCES "${SOURCE_DIR}/relief.cpp")

# generate Python module
add_subdirectory(lib/pybind11)
pybind11_add_module(relief ${SOURCES} "${SOURCE_DIR}/bindings.cpp")
