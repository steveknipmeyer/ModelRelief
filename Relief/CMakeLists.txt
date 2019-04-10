cmake_minimum_required(VERSION 3.11.0)
project(relief)

# source directory
set(SOURCE_DIR "src")

# headers are also in SOURCE_DIR
include_directories(${SOURCE_DIR})

set(SOURCES
    "${SOURCE_DIR}/ModelRelief.cpp"
    "${SOURCE_DIR}/GaussianFilter.cpp"
    "${SOURCE_DIR}/GaussianKernel.cpp"
    "${SOURCE_DIR}/StopWatch.cpp"
    )

# generate Python module
add_subdirectory(lib/pybind11)
pybind11_add_module(relief ${SOURCES} "${SOURCE_DIR}/bindings.cpp")

SET(TEST_DIR "tests/c++")
SET(TESTS ${SOURCES}
    "${TEST_DIR}/main.cpp"
    "${TEST_DIR}/GaussianKernelTests.cpp")

# generate unit test executable
include_directories(../devenv/include)
link_directories(../devenv/libs)

include_directories()
include_directories(lib/pybind11/include)
include_directories(lib/Catch2/single_include/catch2)

add_executable("${PROJECT_NAME}UnitTests" ${TESTS})