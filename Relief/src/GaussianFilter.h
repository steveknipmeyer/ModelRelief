/**
 * @brief Class implementing a Gaussian filter for image processing.
 *
 * @file GaussianFilter.h
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once

#include "ModelRelief.h"

namespace ModelRelief {

//-------------------------------------------------------------------------------------------------//
//                                      Forward Declarations                                       //
//-------------------------------------------------------------------------------------------------//
class GaussianFilter;

//-------------------------------------------------------------------------------------------------//
//                                      Types                                                      //
//-------------------------------------------------------------------------------------------------//

/**
 * @brief Class implementing a Gaussian filter for image processing.
 *
 */
class GaussianFilter {

    private:
        int m_rows;                 // image rows
        int m_columns;              // image columns

        double *m_pImage;           // raw pointer to image
        double *m_pMask;            // raw pointer to mask
        double m_sigma;             // Gaussian variance for the filter

    public:
        GaussianFilter(NPDoubleArray& image, NPDoubleArray& mask, double sigma);
        ~GaussianFilter();

    private:
        void InitializeNative(NPDoubleArray& image, NPDoubleArray& mask);
};
}
