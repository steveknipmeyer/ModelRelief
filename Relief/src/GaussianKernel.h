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
        double  m_sigma;                    // standard deviation
        int     m_kernelRadius;             // kernel radius
        int     m_kernelSize;               // dimension of kernel array
        int     m_rows;                     // kernel rows
        int     m_columns;                  // kernel columns
        int     m_xLimit;                   // x bound    
        int     m_yLimit;                   // y bound

        std::unique_ptr<double[]> m_kernel; // default (unmasked) kernel

        void Iterate(KernelCallback callback, void* pArguments);
        void Gaussian(int x, int y, void* pArguments);
        void Sum(int x, int y, void* pArguments);
        void GaussianKernel::NormalizeElement(int x, int y, void* pArguments);

    public:
        GaussianKernel(double sigma);
        ~GaussianKernel(); 

        int KernelSize() const;
        int Rows() { return m_rows; }
        int Columns() { return m_columns; }
        int XLimit() { return m_xLimit; }
        int YLimit() { return m_yLimit; }

        const double* Elements() const;
        double& Element(int x, int y);

        void CalculateStandard();
        void Normalize();
        void Display();

    public:
        static int Radius(double sigma);
};
}