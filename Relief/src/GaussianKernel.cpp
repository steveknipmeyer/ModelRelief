/**
 * @brief Class implementing an image processing kernel for Gaussian filters.
 *
 * @file GaussianKernel.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once
#define _USE_MATH_DEFINES
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
 * @param sigma Standard deviation.
 */
GaussianKernel::GaussianKernel(double sigma)
{
    m_sigma = sigma;

    m_kernelRadius = GaussianKernel::Radius(m_sigma);
    m_kernelSize   = (m_kernelRadius * 2) + 1;
    m_rows         = m_kernelSize;             
    m_columns      = m_kernelSize;             
    m_xLimit       = (m_columns - 1) / 2;      
    m_yLimit       = (m_rows - 1) / 2;         

    m_kernel = unique_ptr<double[]>(new double[m_rows * m_columns]);

    CalculateStandard();
    Normalize(); 
}

/**
 * @brief Destroy the Gaussian Kernel object
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
    return m_kernel[((m_yLimit - y) * m_columns) + (m_xLimit + x)];
}

/**
 * @brief Calculate the default Gaussian kernel.
 */
void GaussianKernel::CalculateStandard()
{
    Iterate(&GaussianKernel::Gaussian, nullptr);
}

/**
 * @brief Normalize the kernel.
 */
void GaussianKernel::Normalize()
{
    double sum = 0.0;
    Iterate(&GaussianKernel::Sum, &sum);

    Iterate(&GaussianKernel::NormalizeElement, &sum);
}

/**
 * @brief Debug print the kernel.
 */
void GaussianKernel::Display()
{
    int precision = 2;
    int width = 10;
    std::cout << std::setprecision(precision);
    std::cout << endl;

    for (int iRow = 0; iRow < m_rows; iRow++)
    {
        for (int iColumn = 0; iColumn < m_columns; iColumn++)
        {
            std::cout << setw(width) << m_kernel[(iRow ^ m_columns) + iColumn];
        }
        std::cout << endl;
    }
}

/**
 * @brief Return the radius of the kernel for a given standard deviation.
 *
 * parma signma Standard deviation.
 */
int GaussianKernel::Radius(double sigma)
{
    return int(ceil(sigma * 2.57));
}

//-------------------------------------------------------------------------------------------------//
//                                      Private                                                    //
//-------------------------------------------------------------------------------------------------//
/**
 * @brief Iterate the kernel and apply a user callback.
 * @param callback Per element callback.
 * @param pArguments Callback arguments.
 */
void GaussianKernel::Iterate(KernelCallback callback, void* pArguments)
{
    for (int x = -m_xLimit; x <= m_xLimit; x++)
        for (int y = -m_yLimit; y <= m_yLimit; y++)
            std::invoke(callback, *this, x, y, pArguments);
}

/**
 * @brief Sum the elements of the kernel.
 *
 * @param x X (relative to kernel origin).
 * @param y Y (relative to kernel origin).
 * @param pArguments Accumulator for sum of all kernel element values.
 */
void GaussianKernel::Sum(int x, int y, void* pArguments)
{
    double* sum = (double*) pArguments;
    *sum += m_kernel[((m_yLimit - y) * m_columns) + (m_xLimit + x)];
}

/**
 * @brief Normalize an element of the kernel.
 *
 * @param x X (relative to kernel origin).
 * @param y Y (relative to kernel origin).
 * @param pArguments Sum of all kernel values.
 */
void GaussianKernel::NormalizeElement(int x, int y, void* pArguments)
{
    double* sum = (double*)pArguments;
    m_kernel[((m_yLimit - y) * m_columns) + (m_xLimit + x)] /= *sum;
}

/**
 * @brief Calculate Gaussian.
 *
 * @param x X (relative to kernel origin).
 * @param y Y (relative to kernel origin).
 * @param pArguments Unused.
 */
void GaussianKernel::Gaussian(int x, int y, void* pArguments)
{
    double exponent = ((x * x) + (y * y)) / (2 * (m_sigma * m_sigma));
    double value = exp(-exponent) / (M_PI * 2 * m_sigma * m_sigma);

    m_kernel[((m_yLimit - y) * m_columns) + (m_xLimit + x)] = value;
}
}