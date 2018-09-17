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

//-------------------------------------------------------------------------------------------------//
//                                      Forward Declarations                                       //
//-------------------------------------------------------------------------------------------------//
class GaussianKernel;

//-------------------------------------------------------------------------------------------------//
//                                      Types                                                      //
//-------------------------------------------------------------------------------------------------//
using KernelCallback = auto (GaussianKernel::*) (int x, int y, void* pArguments) -> void;
using GaussianKernelP = GaussianKernel*;
using GaussianKernelR = GaussianKernel&;

/**
 * @brief Class implementing an image processing kernel for Gaussian filters.
 * 
 */
class GaussianKernel {
    private:
        static const int kernelSize = 33;                       // radius = int(truncate * sigma + 0.5)
        static const int s_rows    = kernelSize ;               // kernel rows
        static const int s_columns = kernelSize;                // kernel columns
        static const int s_xLimit  = (s_columns - 1) / 2;       // x bound    
        static const int s_yLimit  = (s_rows - 1) / 2;          // y bound

        double m_sigma;                                         // standard deviation
        double m_kernel[s_rows][s_columns];                     // default (unmasked) kernel

        void Iterate(KernelCallback callback, void* pArguments);
        void Gaussian(int x, int y, void* pArguments);
        void Sum(int x, int y, void* pArguments);
        void GaussianKernel::NormalizeElement(int x, int y, void* pArguments);

    public:
        GaussianKernel(double sigma);
        ~GaussianKernel(); 

        int Rows() { return s_rows; }
        int Columns() { return s_columns; }
        int XLimit() { return s_xLimit; }
        int YLimit() { return s_yLimit; }

        double& Element(int x, int y);

        void CalculateStandard();
        void Normalize();
        void Display();
};
}