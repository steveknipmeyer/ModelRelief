/**
 * @brief Support for Gaussian filters in relief processing.
 *
 * @file GaussianFilter.cpp
 * @afstoputhor Steve Knipmeyer
 * @date 2018-09-03
 */
#define _USE_MATH_DEFINES
#include <iostream>
#include <cmath>
#include <iomanip>
#include <assert.h>

#include "ModelRelief.h"
#include "GaussianFilter.h"
#include "StopWatch.h"

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
GaussianFilter::GaussianFilter(NPDoubleArray& image, NPDoubleArray& mask, double sigma) : m_image(image), m_mask(mask), m_defaultKernel(new GaussianKernel(sigma))
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
 * @brief GaussianBlur1
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 1
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @return NPDoubleArray&
 *
 */
void GaussianFilter::GaussianBlur1 (double* pSource, double* pResult, int width, int height, double sigma)
{
    // significant radius
    int radius = int(ceil(sigma * 2.57));

    for (int row = 0; row < height; row++)
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            double gaussianSum = 0;
            for (int iRow = row - radius; iRow < row + radius + 1; iRow++)
                for (int iColumn = column - radius; iColumn < column + radius + 1; iColumn++)
                {
                    double kernelX = abs(iColumn - column);
                    double kernelY = abs(iRow - row);

                    double distanceSquared = (kernelX * kernelX) + (kernelY * kernelY);
                    double gaussian = exp(-distanceSquared / (2 * sigma*sigma)) / (M_PI * 2 * sigma*sigma);

                    int x = min(width - 1, max(0, iColumn));
                    int y = min(height - 1, max(0, iRow));
                    value += pSource[y*width + x] * gaussian;
                    gaussianSum += gaussian;
                }
            pResult[row*width + column] = round(value / gaussianSum);
        }
}

/**
 * @brief GaussianBlur1A
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 1
 * In this implementation, the gaussian kernel is pre-calculated.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @return NPDoubleArray&
 *
 */
void GaussianFilter::GaussianBlur1A(double* pSource, double* pResult, int width, int height, double sigma)
{
    GaussianKernel gaussianKernel(m_sigma);

    // significant radius
    int radius = int(ceil(sigma * 2.57));
    //std::cout << "GaussianBlur1A radius = " << radius << std::endl;

    for (int row = 0; row < height; row++)
    {
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            for (int iRow = row - radius; iRow < row + radius + 1; iRow++)
            {
                for (int iColumn = column - radius; iColumn < column + radius + 1; iColumn++)
                {
                    int kernelX = iColumn - column;
                    int kernelY = iRow - row;
                    double gaussian = gaussianKernel.Element(kernelX, kernelY);

                    int x = min(width - 1, max(0, iColumn));
                    int y = min(height - 1, max(0, iRow));
                    value += pSource[y*width + x] * gaussian;
                }
            }
            pResult[row*width + column] = value;
        }
    }
}

/**
 * @brief GaussianBlur2
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 2
 * In this implementation, multiple passes of a box filter are used.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @return NPDoubleArray&
 *
 */
void GaussianFilter::GaussianBlur2(double* pSource, double* pResult, int width, int height, double sigma)
{
    int passes = 8;
    std::vector<int> boxSizes = BoxBlurSizes(sigma, passes);

    for (int iPass = 0; iPass < passes; iPass++)
    {
        int radius = boxSizes.at(iPass);
        std::cout << "GaussianBlur2 radius = " << radius << std::endl;
        for (int row = 0; row < height; row++)
        {
            for (int column = 0; column < width; column++)
            {
                double value = 0;
                for (int iRow = row - radius; iRow < row + radius + 1; iRow++)
                {
                    for (int iColumn = column - radius; iColumn < column + radius + 1; iColumn++)
                    {
                        int kernelX = iColumn - column;
                        int kernelY = iRow - row;

                        int x = min(width - 1, max(0, iColumn));
                        int y = min(height - 1, max(0, iRow));
                        value += pSource[y*width + x];
                    }
                }
                double boxElements = (2 * radius) * (2 * radius);
                pResult[row*width + column] = value / boxElements;
            }
        }
    }
}

/**
 * @brief Calculate the filter.
 *
 * @param algorithm Filter algorithm to use.
 * @return NPDoubleArray&
 *
 */
NPDoubleArray GaussianFilter::Calculate(int algorithm)
{
    // allocate output buffer
    NPDoubleArray result = NPDoubleArray(m_columns * m_rows);
    py::buffer_info resultBuffer = result.request();
    double *pResult = (double *)resultBuffer.ptr;

    switch (algorithm)
    {
        case 1:
            cout << "GaussianFilter" << endl;
            for (int row = 0; row < m_rows; row++)
            {
                for (int column = 0; column < m_columns; column++)
                {
                    pResult[row*m_columns + column] = ApplyKernel(*m_defaultKernel, row, column);
                }
            }
            break;

        case 2:
            cout << "GaussianBlur1" << endl;
            GaussianBlur1(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 3:
            cout << "GaussianBlur1A" << endl;
            GaussianBlur1A(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 4:
            cout << "GaussianBlur2" << endl;
            GaussianBlur2(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;
    }

    // reshape result to have same shape as input
    result.resize({ m_columns, m_rows});

    return result;
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
    m_pImage = (double *)buffer.ptr;
    m_rows = static_cast<int>(buffer.shape[0]);
    m_columns = static_cast<int>(buffer.shape[1]);

    // Mask
    buffer = mask.request();
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

     // iteration: row major for performance
    for (int kernelY = kernelYLimit; kernelY >= -kernelYLimit; kernelY--)
    {
        for (int kernelX = -kernelXLimit; kernelX <= kernelXLimit; kernelX++)
        {
            double imageElement = GetOffsetImageElement(row, column, kernelX, kernelY);
            sum += imageElement * kernel.Element(kernelX, kernelY);
        }
    }

    return sum;
}

/**
 * @brief Returns a collection of box sizes to support Gaussian filter approximation.
 *        https://www.peterkovesi.com/matlabfns/
 * @param sigma Standard deviation.
 * @param passes Number of passes.
 * @return std::vector<float> Collection of box sizes.
 */
std::vector<int> GaussianFilter::BoxBlurSizes(double sigma, int passes)
{
    double variance = sigma*sigma;

    // ideal averaging filter width
    double widthIdeal = sqrt((12 * variance / passes) + 1);

    int widthLower = int(floor(widthIdeal));
    if(widthLower %2 == 0)
        widthLower--;
    int widthUpper = widthLower + 2;

    int passesIdeal = int(round(((12 * variance) - (passes * widthLower * widthLower) - (4 * (passes * widthLower)) - (3 * passes)) / ((-4 * widthLower) - 4)));
    double sigmaActual = sqrt( (passesIdeal * widthLower * widthLower + (passes - passesIdeal) * widthUpper * widthUpper - passes) / 12);

    std::vector<int> sizes;
    for (int iSize = 0; iSize < passes; iSize++)
        sizes.push_back(iSize < passesIdeal ? widthLower : widthUpper);

    return sizes;
}

}