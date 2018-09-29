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
  */
GaussianFilter::~GaussianFilter()
{
}

/**
 * @brief Baseline
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @return NPDoubleArray&
 */
void GaussianFilter::Baseline(double* pSource, double* pResult, int width, int height, double sigma)
{
    for (int row = 0; row < m_rows; row++)
        for (int column = 0; column < m_columns; column++)
        {
            pResult[row*m_columns + column] = ApplyKernel(*m_defaultKernel, row, column);
        }
}

/**
 * @brief Gaussian
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 1
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @return NPDoubleArray&
 */
void GaussianFilter::Gaussian (double* pSource, double* pResult, int width, int height, double sigma)
{
    // significant radius
    int radius = GaussianKernel::Radius(sigma);

    for (int row = 0; row < height; row++)
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            double gaussianSum = 0;
            for (int iRow = row - radius; iRow <= row + radius; iRow++)
                for (int iColumn = column - radius; iColumn <= column + radius; iColumn++)
                {
                    double kernelX = abs(iColumn - column);
                    double kernelY = abs(iRow - row);

                    double distanceSquared = (kernelX * kernelX) + (kernelY * kernelY);
                    double gaussian = exp(-distanceSquared / (2 * sigma * sigma)) / (M_PI * 2 * sigma * sigma);

                    int x = min(width - 1, max(0, iColumn));
                    int y = min(height - 1, max(0, iRow));
                    value += pSource[(y * width) + x] * gaussian;
                    gaussianSum += gaussian;
                }
            pResult[(row * width) + column] = value / gaussianSum;
        }
}

/**
 * @brief GaussianCached
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 1
 * In this implementation, the gaussian kernel is pre-calculated.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 *
 * @return NPDoubleArray&
  */
void GaussianFilter::GaussianCached(double* pSource, double* pResult, int width, int height, double sigma)
{
    GaussianKernel gaussianKernel(m_sigma);
    const double* pKernel = gaussianKernel.Elements();
    int kernelSize = gaussianKernel.KernelSize();
    int radius = GaussianKernel::Radius(sigma);

    for (int row = 0; row < height; row++)
    {
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            int kernelRow = 0;
            for (int iRow = row - radius; iRow <= row + radius; iRow++)
            {
                int kernelColumn = 0;
                for (int iColumn = column - radius; iColumn <= column + radius; iColumn++)
                {
                    int x = iColumn;
                    int y = iRow;
                    if (x < 0) x = 0;
                    if (x >= width) x = width - 1;
                    if (y < 0) y = 0;
                    if (y >= height) y = height - 1;

                    double imageElement = pSource[(y * width) + x];
                    double gaussian = *(pKernel + (kernelRow * kernelSize) + kernelColumn);
                    value += imageElement * gaussian;

                    kernelColumn++;
                }
                kernelRow++;
            }
            pResult[(row * width) + column] = value;
        }
    }
}
/**
 * @brief Box
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 2
 * In this implementation, multiple passes of a box filter are used.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::Box(double* pSource, double* pResult, int width, int height, double sigma)
{
    int passes = 5;
    std::vector<int> boxSizes = BoxSizes(sigma, passes);

    auto intermediate = unique_ptr<double[]>(new double[width * height]);
    double* pIntermediate = intermediate.get();

    memcpy (intermediate.get(), pSource, sizeof(double) * width * height);
    for (int iPass = 0; iPass < passes; iPass++)
    {
        int radius = (boxSizes.at(iPass) - 1)  / 2;
        double boxElements = pow(((2 * radius) + 1), 2);
        for (int row = 0; row < height; row++)
        {
            for (int column = 0; column < width; column++)
            {
                double value = 0;
                for (int iRow = row - radius; iRow <= row + radius; iRow++)
                {
                    for (int iColumn = column - radius; iColumn <= column + radius; iColumn++)
                    {
                        int x = iColumn;
                        int y = iRow;
                        if (x < 0) x = 0;
                        if (x >= width) x = width - 1;
                        if (y < 0) y = 0;
                        if (y >= height) y = height - 1;

                        value += pIntermediate[(y * width) + x];
                    }
                }
                pResult[(row * width) + column] = value / boxElements;
            }
        }
        memcpy(pIntermediate, pResult, sizeof(double) * width * height);
    }
}

/**
 * @brief BoxIndependent
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 3
 * Performs a box blur in two passes, horizontally and then vertically.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxIndependent(double* pSource, double* pResult, int width, int height, double sigma)
{
    int passes = 5;
    std::vector<int> boxSizes = BoxSizes(sigma, passes);

    auto intermediate1 = unique_ptr<double[]>(new double[width * height]);
    double* pIntermediate1 = intermediate1.get();
    auto intermediate2 = unique_ptr<double[]>(new double[width * height]);
    double* pIntermediate2 = intermediate2.get();

    memcpy(intermediate1.get(), pSource, sizeof(double) * width * height);
    for (int iPass = 0; iPass < passes; iPass++)
    {
        int radius = (boxSizes.at(iPass) - 1) / 2;

        BoxPassH(pIntermediate1, pIntermediate2, width, height, sigma, radius);
        BoxPassV(pIntermediate2, pResult,        width, height, sigma, radius);

        if (iPass < (passes - 1))
            memcpy(intermediate1.get(), pResult, sizeof(double) * width * height);
    }
}

/**
 * @brief BoxIndependentDelta
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 4
 * Performs a box blur in two passes, horizontally and then vertically.
 * The summs are optimized by incrementally modifying the previous sum.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxIndependentDelta(double* pSource, double* pResult, int width, int height, double sigma)
{
    int passes = 5;
    std::vector<int> boxSizes = BoxSizes(sigma, passes);

    auto intermediate1 = unique_ptr<double[]>(new double[width * height]);
    double* pIntermediate1 = intermediate1.get();
    auto intermediate2 = unique_ptr<double[]>(new double[width * height]);
    double* pIntermediate2 = intermediate2.get();

    memcpy(intermediate1.get(), pSource, sizeof(double) * width * height);
    for (int iPass = 0; iPass < passes; iPass++)
    {
        int radius = (boxSizes.at(iPass) - 1) / 2;

        BoxPassHDelta(pIntermediate1, pIntermediate2, width, height, sigma, radius);
        BoxPassVDelta(pIntermediate2, pResult, width, height, sigma, radius);

        if (iPass < (passes - 1))
            memcpy(intermediate1.get(), pResult, sizeof(double) * width * height);
    }
}

/**
 * @brief Calculate the filter.
 *
 * @param algorithm Filter algorithm to use.
 *
 * @return NPDoubleArray&
 */
NPDoubleArray GaussianFilter::Calculate(int algorithm)
{
    // algorithm step counter
    m_counter = 0;

    // allocate output buffer
    NPDoubleArray result = NPDoubleArray(m_columns * m_rows);
    py::buffer_info resultBuffer = result.request();
    double *pResult = (double *)resultBuffer.ptr;

    switch (algorithm)
    {
        case 0:
            //cout << "Baseline" << endl;
            Baseline(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 1:
            //cout << "Gaussian" << endl;
            Gaussian(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 11:
            //cout << "GaussianCached" << endl;
            GaussianCached(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 2:
            //cout << "Box" << endl;
            Box(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 3:
            //cout << "BoxIndependent" << endl;
            BoxIndependent(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;

        case 4:
            //cout << "BoxIndependentDelta" << endl;
            BoxIndependentDelta(m_pImage, pResult, m_columns, m_rows, m_sigma);
            break;
    }

    // reshape result to have same shape as input
    result.resize({ m_rows, m_columns});

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
 *
 * @return double Image element corresponding to [row + xOffset, column + yOffset].
 */
double GaussianFilter::GetOffsetImageElement(int row, int column, int xOffset, int yOffset)
{
#if REFLECT_EDGES
    // N.B. Out of bounds elements are mapped to <reflected> elements.
    int targetRow    = row + yOffset;
    int targetColumn = column + xOffset;

    // column bounds check
    if (targetColumn < 0)
        targetColumn = abs(column + xOffset);
    if (targetColumn > (m_columns - 1))
        targetColumn = (m_columns - 1) - ((column + xOffset) - (m_columns - 1));

    // row bounds check
    if (targetRow < 0)
        targetRow = abs(row + yOffset);
    if (targetRow > (m_rows - 1))
        targetRow = (m_rows - 1) - ((row + yOffset) - (m_rows - 1));
#else
    int targetRow = row + yOffset;
    int targetColumn = column + xOffset;

    // column bounds check
    if (targetColumn < 0)
        targetColumn = 0;
    if (targetColumn > (m_columns - 1))
        targetColumn = (m_columns - 1);

    // row bounds check
    if (targetRow < 0)
        targetRow = 0;
    if (targetRow > (m_rows - 1))
        targetRow = (m_rows - 1);
#endif

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
 *
 * @return double Kernel convolved with element neighborhood.
 */
double GaussianFilter::ApplyKernel(GaussianKernel& kernel, int row, int column)
{
    double sum = 0.0;
    int kernelXLimit = kernel.XLimit();
    int kernelYLimit = kernel.YLimit();

     // row major for performance
    for (int kernelY = kernelYLimit; kernelY >= -kernelYLimit; kernelY--)
    {
        for (int kernelX = -kernelXLimit; kernelX <= kernelXLimit; kernelX++)
        {
            double imageElement = GetOffsetImageElement(row, column, kernelX, kernelY);
            sum += imageElement * kernel.Element(kernelX, kernelY);
            m_counter++;
        }
    }
    return sum;
}

/**
 * @brief Returns a collection of box sizes to support Gaussian filter approximation.
 *        https://www.peterkovesi.com/matlabfns/
 * @param sigma Standard deviation.
 * @param passes The number of average filterings to be used to approximate the Gaussian.  This should be a minimum of 3, using 4 is better.
 *               If the smoothed image is to be differentiated an additional averaging should be applied for each derivative.
 *               if a second derivative is to be taken at least 5 averagings should be applied.
 *
 * @return std::vector<float> Collection of box sizes.
 */
std::vector<int> GaussianFilter::BoxSizes(double sigma, int passes)
{
    double variance = sigma*sigma;

    // ideal averaging filter width
    double widthIdeal = sqrt((12 * variance / passes) + 1);

    int widthLower = int(floor(widthIdeal));
    if(widthLower % 2 == 0)
        widthLower--;
    int widthUpper = widthLower + 2;

    int passesIdeal = int(round(((12 * variance) - (passes * widthLower * widthLower) - (4 * (passes * widthLower)) - (3 * passes)) / ((-4 * widthLower) - 4)));
    double sigmaActual = sqrt( (passesIdeal * widthLower * widthLower + (passes - passesIdeal) * widthUpper * widthUpper - passes) / 12);

    std::vector<int> sizes;
    for (int iSize = 0; iSize < passes; iSize++)
        sizes.push_back(iSize < passesIdeal ? widthLower : widthUpper);

    return sizes;
}

/**
 * @brief BoxPass
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 2
 * In this implementation, multiple passes of a box filter are used.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @param radius Box size.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxPass(double* pSource, double* pResult, int width, int height, double sigma, int radius)
{
    double boxElements = pow(((2 * radius) + 1), 2);
    for (int row = 0; row < height; row++)
    {
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            for (int iRow = row - radius; iRow <= row + radius; iRow++)
            {
                for (int iColumn = column - radius; iColumn <= column + radius; iColumn++)
                {
                    int x = iColumn;
                    int y = iRow;
                    if (x < 0) x = 0;
                    if (x >= width) x = width - 1;
                    if (y < 0) y = 0;
                    if (y >= height) y = height - 1;

                    value += pSource[y * width + x];
                }
            }
            pResult[(row * width) + column] = value / boxElements;
        }
    }
}

/**
 * @brief BoxPassH
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 3
 * Performs a horizontal box blur.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @param radius Box size.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxPassH(double* pSource, double* pResult, int width, int height, double sigma, int radius)
{
    double elementCount = (2 * radius) + 1;
    for (int row = 0; row < height; row++)
    {
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            for (int iColumn = column - radius; iColumn <= column + radius; iColumn++)
            {
                int x = iColumn;
                if (x < 0) x = 0;
                if (x >= width) x = width - 1;

                value += pSource[row * width + x];
            }
        pResult[(row * width) + column] = value / elementCount;
        }
    }
}

/**
 * @brief BoxPassV
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 3
 * Performs a vertical box blur.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @param radius Box size.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxPassV(double* pSource, double* pResult, int width, int height, double sigma, int radius)
{
    double elementCount = (2 * radius) + 1;
    for (int row = 0; row < height; row++)
    {
        for (int column = 0; column < width; column++)
        {
            double value = 0;
            for (int iRow = row - radius; iRow <= row + radius; iRow++)
            {
                int y = iRow;
                if (y < 0) y = 0;
                if (y >= height) y = height - 1;

                value += pSource[(y * width) + column];
            }
            pResult[(row * width) + column] = value / elementCount;
        }
    }
}

/**
 * @brief BoxPassHDelta
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 4
 * Performs a horizontal box blur. The sums are optimized by using the previous thisSum.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @param radius Box size.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxPassHDelta(double* pSource, double* pResult, int width, int height, double sigma, int radius)
{
    double elementCount = (2 * radius) + 1;
    for (int row = 0; row < height; row++)
    {
        double firstColumnSum = radius * pSource[row * width];
        for (int iColumn = 0; iColumn <= radius; iColumn++)
        {
            firstColumnSum += pSource[row * width + iColumn];
        }
        pResult[row * width] = firstColumnSum / elementCount;

        double previousSum = firstColumnSum;
        for (int column = 1; column < width; column++)
        {
            int previousSumLeftColumnIndex = column - radius - 1;
            if (previousSumLeftColumnIndex < 0) previousSumLeftColumnIndex = 0;
            double previousSumLeftElement = pSource[(row * width) + previousSumLeftColumnIndex];

            int thisSumRightColumnIndex = column + radius;
            if (thisSumRightColumnIndex >= width) thisSumRightColumnIndex = width - 1;
            double thisSumRightElement = pSource[(row * width) + thisSumRightColumnIndex];

            double thisSum = previousSum - previousSumLeftElement + thisSumRightElement;

            pResult[(row * width) + column] = thisSum / elementCount;
            previousSum = thisSum;
        }
    }
}

/**
 * @brief BoxPassVDelta
 * http://blog.ivank.net/fastest-gaussian-blur.html#results
 * Algorithm 3
 * Performs a vertical box blur. The sums are optimized by using the previous thisSum.
 *
 * @param pSource Source image.
 * @param pResult Result image.
 * @param width Image width.
 * @param height Image Height.
 * @param sigma Standard deviation.
 * @param radius Box size.
 *
 * @return NPDoubleArray&
 */
void GaussianFilter::BoxPassVDelta(double* pSource, double* pResult, int width, int height, double sigma, int radius)
{
    double elementCount = (2 * radius) + 1;
    for (int column = 0; column < width; column++)
    {
        double firstRowSum = radius * pSource[column];
        for (int iRow = 0; iRow <= radius; iRow++)
        {
            firstRowSum += pSource[(iRow * width) + column];
        }
        pResult[column] = firstRowSum / elementCount;

        double previousSum = firstRowSum;
        for (int row = 1; row < height; row++)
        {
            int previousSumTopRowIndex = row - radius - 1;
            if (previousSumTopRowIndex < 0) previousSumTopRowIndex = 0;
            double previousSumTopElement = pSource[(previousSumTopRowIndex * width) + column];

            int thisSumBottomRowIndex = row + radius;
            if (thisSumBottomRowIndex >= height) thisSumBottomRowIndex = height - 1;
            double thisSumBottomElement = pSource[(thisSumBottomRowIndex * width) + column];

            double thisSum = previousSum - previousSumTopElement + thisSumBottomElement;

            pResult[(row * width) + column] = thisSum / elementCount;
            previousSum = thisSum;
        }
    }
}
}