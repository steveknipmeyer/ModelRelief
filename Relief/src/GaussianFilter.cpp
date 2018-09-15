/**
 * @brief Support for Gaussian filters in relief processing.
 *
 * @file GaussianFilter.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#include <iostream>
#include <cmath>
#include <iomanip>

#include "ModelRelief.h"
#include "GaussianFilter.h"

using namespace std;

namespace ModelRelief {

//-------------------------------------------------------------------------------------------------//
//                                      Public                                                     //
//-------------------------------------------------------------------------------------------------//

/**
    * @brief Construct a new Gaussian Filter instance.
    *
    * @param sigma Variance.
    * @param image NumPy image.
    * @param mask NumPy mask. Only unmasked image elements are included in the filter.
    */
GaussianFilter::GaussianFilter(NPDoubleArray& image, NPDoubleArray& mask, double sigma)
{
    m_sigma = sigma;
    InitializeNative(image, mask);
}

/**
    * @brief Destroy the Gaussian Filter instance.
    *
    */
GaussianFilter::~GaussianFilter()
{
}

//-------------------------------------------------------------------------------------------------//
//                                      Private                                                    //
//-------------------------------------------------------------------------------------------------//

/**
 * @brief Convert the NumPy array and mask references to pointers.
 *
    * @param image NumPy image.
    * @param mask NumPy mask. Only unmasked image elements are included in the filter.
 */
void GaussianFilter::InitializeNative(NPDoubleArray& image, NPDoubleArray& mask)
{
    // Image
    py::buffer_info buffer = image.request();

    // raw pointer
    m_pImage = (double *)buffer.ptr;
    m_rows = buffer.shape[0];
    m_columns = buffer.shape[1];

    // Mask
    buffer = mask.request();

    // raw pointer
    m_pMask = (double *)buffer.ptr;
}

}