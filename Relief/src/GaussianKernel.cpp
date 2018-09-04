/**
 * @brief Class implementing an image processing kernel for Gaussian filters.
 * 
 * @file GaussianKernel.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once

#include <iostream>
#include <cmath>
#include <iomanip>

#include "ModelRelief.h"
#include "GaussianKernel.h"

using namespace std;

namespace ModelRelief {
//-------------------------------------------------------------------------------------------------//
//                                      Public                                                     //
//-------------------------------------------------------------------------------------------------//

/**
 * @brief Construct a new Gaussian Kernel object
 * 
 * @param sigma Variance.
 */
GaussianKernel::GaussianKernel(double sigma)
{
    m_sigma = sigma;

    CalculateDefault();
    Normalize();
}

/**
 * @brief Destroy the Gaussian Kernel object
 * 
 */
GaussianKernel::~GaussianKernel() 
{       
}

/**
 * @brief Returns a kernel element.
 *
 * @param x X (relative to kernel origin).
 * @param y Y (relative to kernel origin).
 */
double& GaussianKernel::Element (int x, int y)
{
    return m_kernel[s_yLimit - y][s_xLimit + x];
}

/**
 * @brief Calculate the default Gaussian kernel.
 *
 */
void GaussianKernel::CalculateDefault()
{
    Iterate(&GaussianKernel::Gaussian, nullptr);
}

/**
 * @brief Normalize the kernel.
 *
 */
void GaussianKernel::Normalize()
{
    double sum = 0.0;
    Iterate(&GaussianKernel::Sum, &sum);

    Iterate(&GaussianKernel::NormalizeElement, &sum);
}

/**
 * @brief Debug print the kernel.
 *
 */
void GaussianKernel::Display()
{
    int precision = 2;
    int width = 10;
    std::cout << std::setprecision(precision);
    std::cout << endl;

    for (int iRow = 0; iRow < s_rows; iRow++)
    {
        for (int iColumn = 0; iColumn < s_columns; iColumn++)
        {
            std::cout << setw(width) << m_kernel[iRow][iColumn];
        }
        std::cout << endl;
    }
}

//-------------------------------------------------------------------------------------------------//
//                                      Private                                                    //
//-------------------------------------------------------------------------------------------------//
/**
 * @brief Iterate the kernel and apply a user callback.
 *
 */
void GaussianKernel::Iterate(KernelCallback callback, void* pArguments)
{
    for (int x = -s_xLimit; x <= s_xLimit; x++)
        for (int y = -s_yLimit; y <= s_yLimit; y++)
            std::invoke(callback, *this, x, y, pArguments);
}

/**
 * @brief Sum the elements of the kernel.
 *
 * @param pArguments Accumulator for sum of all kernel element values.
 */
void GaussianKernel::Sum(int x, int y, void* pArguments)
{
    double* sum = (double*) pArguments;
    *sum += m_kernel[s_yLimit - y][s_xLimit + x];
}

/**
 * @brief Normalize an element of the kernel.
 *
 * @param pArguments Sum of all kernel values.
 */
void GaussianKernel::NormalizeElement(int x, int y, void* pArguments)
{
    double* sum = (double*)pArguments;
    m_kernel[s_yLimit - y][s_xLimit + x] /= *sum;
}

/**
 * @brief Calculate Gaussian.
 *
 */
void GaussianKernel::Gaussian(int x, int y, void* pArguments)
{
    double exponent = ((x * x) + (y * y)) / (2 * (m_sigma * m_sigma));
    double value = exp(-exponent);
    m_kernel[s_yLimit - y][s_xLimit + x] = value;
}
}