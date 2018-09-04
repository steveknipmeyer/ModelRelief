/**
 * @brief Support for GaussianKernel unit tests.
 *
 * @file GaussianKernelTests.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#include <iostream>
#include <cmath>
#include <iomanip>

#include <catch.hpp>

#include "ModelRelief.h"
#include "GaussianKernel.h"

using namespace ModelRelief;

TEST_CASE("GaussianKernel")
{
    REQUIRE(kernelTest() == 1);
}