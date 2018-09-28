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
        int m_counter;                              // algorithm counter

    private:
        int m_rows;                                 // image rows
        int m_columns;                              // image columns

        NPDoubleArray& m_image;                     // image array
        double *m_pImage;                           // raw pointer to image aray

        NPDoubleArray& m_mask;                      // mask array
        double *m_pMask;                            // raw pointer to mask array

        double m_sigma;                             // standard deviation for the Gaussian filter

        std::unique_ptr<GaussianKernel> m_defaultKernel;

    private:
        void InitializeNative(NPDoubleArray& image, NPDoubleArray& mask);
        double GetOffsetImageElement(int row, int column, int xOffset, int yOffset);
        double ApplyKernel(GaussianKernel& kernel, int row, int column);

        std::vector<int> BoxSizes(double sigma, int passes);
        void BoxPass(double* pSource, double* pResult, int width, int height, double sigma, int radius);
        void BoxPassH(double* pSource, double* pResult, int width, int height, double sigma, int radius);
        void BoxPassV(double* pSource, double* pResult, int width, int height, double sigma, int radius);
        void BoxPassHDelta(double* pSource, double* pResult, int width, int height, double sigma, int radius);
        void BoxPassVDelta(double* pSource, double* pResult, int width, int height, double sigma, int radius);

public:
        GaussianFilter(NPDoubleArray& image, NPDoubleArray& mask, double sigma);
        ~GaussianFilter();

        void Baseline(double* pSource, double* pResult, int width, int height, double sigma);

        void Gaussian(double* pSource, double* pResult, int width, int height, double sigma);
        void GaussianCached(double* pSource, double* pResult, int width, int height, double sigma);
        void Box(double* pSource, double* pResult, int width, int height, double sigma);
        void BoxIndependent(double* pSource, double* pResult, int width, int height, double sigma);
        void BoxIndependentDelta(double* pSource, double* pResult, int width, int height, double sigma);

        NPDoubleArray Calculate(int algorithm);
};
}
