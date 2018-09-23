/**
 * @brief Class implementing a Gaussian filter for image processing.
 *
 * @file GaussianFilter.h
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#pragma once

#include "ModelRelief.h"
#include "GaussianKernel.h"

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
        int m_rows;                                 // image rows
        int m_columns;                              // image columns

        NPDoubleArray& m_image;                     // image array
        double *m_pImage;                           // raw pointer to image aray

        NPDoubleArray& m_mask;                      // mask array
        double *m_pMask;                            // raw pointer to mask array

        double m_sigma;                             // standard deviation for the Gaussian filter

        std::unique_ptr<GaussianKernel> m_pDefaultKernel;

    private:
        void InitializeNative(NPDoubleArray& image, NPDoubleArray& mask);
        double GetOffsetImageElement(int row, int column, int xOffset, int yOffset);
        double ApplyKernel(GaussianKernel& kernel, int row, int column);

    public:
        GaussianFilter(NPDoubleArray& image, NPDoubleArray& mask, double sigma);
        ~GaussianFilter();

        void GaussianBlur1(double* pSource, double* pResult, int width, int height, double sigma);
        void GaussianBlur1A(double* pSource, double* pResult, int width, int height, double sigma);
        NPDoubleArray Calculate();
};
}
