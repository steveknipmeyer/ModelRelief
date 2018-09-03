/**
 * @brief Class implementing an image processing kernel for Gaussian filters.
 * 
 * @file GaussianKernel.h
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once
#include <iostream>
#include <cmath>
#include <iomanip>

#include "ModelRelief.h"

namespace ModelRelief {

/**
 * @brief Class implementing an image processing kernel for Gaussian filters.
 * 
 */
struct GaussianKernel {
    private:
        static const int kernelSize = 5;
        static const int m_rows     = kernelSize ;              // kernel rows
        static const int m_columns = kernelSize;                // kernel columns

        double m_sigma;                                         // variance
        double m_kernel[m_rows][m_columns];                     // default (unmasked) kernel

    public:

        GaussianKernel(double sigma);
        ~GaussianKernel(); 

        void CalculateDefault();
        void Display();
};
}