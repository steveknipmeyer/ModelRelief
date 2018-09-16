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
#include <assert.h>

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
 * @param image NumPy image.
 * @param mask NumPy mask. Only unmasked image elements are included in the filter.
 * @param sigma Standard deviation.
 */
GaussianFilter::GaussianFilter(NPDoubleArray& image, NPDoubleArray& mask, double sigma) : m_image(image), m_mask(mask), m_pDefaultKernel(new GaussianKernel(sigma))
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

/**
 * @brief Calculate the filter.
 *
 * @return NPDoubleArray&
 *
 */
NPDoubleArray& GaussianFilter::Calculate()
{
    GaussianKernel kernel(m_sigma);
    for (int row = 0; row < m_rows; row++)
        for (int column = 0; column < m_columns; column++)
            m_pImage[row*m_columns + column] = ApplyKernel(kernel, row, column);

    return m_image;
}

//-------------------------------------------------------------------------------------------------//
//                                      Private                                                    //
//-------------------------------------------------------------------------------------------------//

/**
 * @brief Convert the NumPy array and mask references to pointers.
 *
 * @param image NumPy image.
 * @param mask NumPy composite mask. Only unmasked image elements are included in the filter.
 */
void GaussianFilter::InitializeNative(NPDoubleArray& image, NPDoubleArray& mask)
{
    // Image
    py::buffer_info buffer = image.request();

    // raw pointer
    m_pImage = (double *)buffer.ptr;
    m_rows = static_cast<int>(buffer.shape[0]);
    m_columns = static_cast<int>(buffer.shape[1]);

    // Mask
    buffer = mask.request();

    // raw pointer
    m_pMask = (double *)buffer.ptr;
}

/**
 * @brief Returns the image element offset from the given row and column.
 *        Elements outside the image bounds are generated by reflection.
 *
 * @param row Image row.
 * @param column Image column.
 * @param xOffset X offset (from column).
 * @param yOffset Y offset (from row).
 * @return double Image element corresponding to [row + xOffset, column + yOffset].
 *
 */
double GaussianFilter::GetOffsetImageElement(int row, int column, int xOffset, int yOffset)
{
    int targetRow    = row + yOffset;
    int targetColumn = column + xOffset;

    // column bounds check
    if (targetColumn < 0)
        targetColumn = abs(long(column + xOffset));
    if (targetColumn > (m_columns - 1))
        targetColumn = (m_columns - 1) - ((column + xOffset) - (m_columns - 1));

    // row bounds check
    if (targetRow < 0)
        targetRow = abs(row + yOffset);
    if (targetRow > (m_rows - 1))
        targetRow = (m_rows - 1) - ((row + yOffset) - (m_rows - 1));

    assert((targetRow >= 0) && (targetRow < m_rows));
    assert((targetColumn >= 0) && (targetColumn < m_columns));

    return m_pImage[targetRow*m_columns + targetColumn];
}

/**
 * @brief Apply the given kernel to an image element.
 *
 * @param kernel Gaussian kernel to apply.
 * @param row Row of image array.
 * @param column Column of image array.
 * @return double Kernel convolved with element neighborhood.
 *
 */
double GaussianFilter::ApplyKernel(GaussianKernel& kernel, int row, int column)
{
    double sum = 0.0;
    int kernelXLimit = kernel.XLimit();
    int kernelYLimit = kernel.YLimit();

    for (int kernelX = -kernelXLimit; kernelX <= kernelXLimit; kernelX++)
    {
        for (int kernelY = -kernelYLimit; kernelY <= kernelYLimit; kernelY++)
        {
            double imageElement = GetOffsetImageElement(row, column, kernelX, kernelY);
            sum += imageElement * kernel.Element(kernelX, kernelY);
        }
    }
    return sum;
}
}   