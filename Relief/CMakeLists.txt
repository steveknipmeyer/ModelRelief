cmake_minimum_required(VERSION 3.11.0)
project(relief)

# Enable for verbose build output.
#set(CMAKE_VERBOSE_MAKEFILE ON)

# https://pybind11.readthedocs.io/en/stable/faq.html
# https://stackoverflow.com/questions/17080869/what-is-the-cmake-equivalent-to-gcc-fvisibility-hidden-when-controlling-the-e
set(CMAKE_CXX_VISIBILITY_PRESET hidden)

# source directory
set(SOURCE_DIR "src")

# headers are also in SOURCE_DIR
include_directories(${SOURCE_DIR})
# WIP: How can python3.6m be mapped to python3.6?
include_directories(../devenv/include/python3.6m)

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
link_directories(../devenv/lib)

include_directories()
include_directories(lib/pybind11/include)
include_directories(lib/Catch2/single_include/catch2)

# N.B. ReliefUnitTests has unresolved (unused) symbols to the Python runtime library.
# The unresolved symbols are treated as warnings (not errors), otherwise the link step fails.
# https://github.com/pybind/pybind11/issues/623
# https://linux.die.net/man/1/ld
set (CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,--warn-unresolved-symbols")

add_executable("${PROJECT_NAME}UnitTests" ${TESTS})