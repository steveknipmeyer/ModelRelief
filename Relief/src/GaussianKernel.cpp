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

/**
 * @brief Construct a new Gaussian Kernel object
 * 
 * @param sigma Variance.
 */
GaussianKernel::GaussianKernel(double sigma)
{
    m_sigma = sigma;

    CalculateDefault();
}

/**
 * @brief Destroy the Gaussian Kernel object
 * 
 */
GaussianKernel::~GaussianKernel() 
{       
}

/**
 * @brief Calculte the default Gaussian kernel.
 * 
 */
void GaussianKernel::CalculateDefault()
{
    int rowBound    = (m_rows - 1) / 2;
    int columnBound = (m_columns - 1) / 2;
    for (int iRow = 0; iRow < m_rows; iRow++)
    {
        int y = rowBound - iRow;
        for (int iColumn = 0; iColumn < m_columns; iColumn++)
        {
            int x = iColumn - columnBound;
            double exponent = (pow(x, 2.0) + pow(y, 2.0)) / (2 * pow(m_sigma, 2.0));
            m_kernel[iRow][iColumn] = exp(-exponent);
        }
    }
}

/**
 * @brief Display the kernel.
 * 
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
            std::cout << setw(width) << m_kernel[iRow][iColumn];
        }
        std::cout << endl;
    }
}
}