/**
 * @brief ModelRelief Python C++ extensions.
 *
 * @file ModelRelief.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-03
 */
#include <pybind11/numpy.h>
#include <memory>

#include "ModelRelief.h"
#include "GaussianFilter.h"
#include "GaussianKernel.h"

namespace py = pybind11;

namespace ModelRelief {

/**
 * @brief Add two NumPy arrays.
 *
 * @param input1 First array.
 * @param input2 Second array.
 * @return NPDoubleArray
 */
NPDoubleArray add_arrays(NPDoubleArray input1, NPDoubleArray input2)
{
   // read input arrays buffer_info
   py::buffer_info buf1 = input1.request(), buf2 = input2.request();
   if (buf1.size != buf2.size)
      throw std::runtime_error("Input shapes must match");

   // allocate the output buffer
   NPDoubleArray result = NPDoubleArray(buf1.size);
   py::buffer_info buf3 = result.request();
   double *ptr1 = (double *) buf1.ptr, *ptr2 = (double *) buf2.ptr, *ptr3 = (double *)buf3.ptr;
   size_t X = buf1.shape[0];
   size_t Y = buf1.shape[1];

   // Add both arrays
   for (size_t idx = 0; idx < X; idx++)
       for (size_t idy = 0; idy < Y; idy++)
           ptr3[idx*Y + idy] = ptr1[idx*Y+ idy] + ptr2[idx*Y+ idy];

   // reshape result to have same shape as input
   result.resize({X,Y});

   return result;
}

/**
 * @brief Fill a NumPy array with a constanct value.
 *
 * @param input Array to populate.
 * @param value Constant fill value.
 * @return NPDoubleArray&
 */
NPDoubleArray& fill(NPDoubleArray& input, double value)
{
    // obtain buffer
    py::buffer_info buffer = input.request();

    // obtain raw pointer
    double *p = (double *)buffer.ptr;
    size_t numberRows     = buffer.shape[0];
    size_t numberColumns  = buffer.shape[1];

#if true
    // fill; row major iteration
    for (size_t indexRows = 0; indexRows < numberRows; indexRows++)
        for (size_t indexColumns = 0; indexColumns < numberColumns; indexColumns++)
            p[indexRows*numberColumns + indexColumns] = value;
#endif

#if false
    // fill; linear iteration
    size_t arrayLength = numberRows * numberColumns;
    double* arrayEnd = p + arrayLength;
    for (p = (double *)buffer.ptr; p < arrayEnd; p++)
        *p = value;
#endif

#if false
    // std library
    std::clock_t start;
    double duration;
    start = std::clock();

    size_t arraySize = numberRows * numberColumns;
    std::fill_n(p, arraySize, value);

    duration = (std::clock() - start) / (double)CLOCKS_PER_SEC;
    std::cout << "fill_n: " << duration << '\n';
#endif

    return input;
}

/**
 * @brief Perform a Gaussian filter on an image.
 *
 * @param image NumPy image.
 * @param mask NumPy mask. Only unmasked image elements are included in the filter.
 * @param sigma Standard deviation.
 * @return NPDoubleArray&
 */
NPDoubleArray& gaussian_filter(NPDoubleArray& image, NPDoubleArray& mask, double sigma)
{
    GaussianFilter filter(image, mask, sigma);
    NPDoubleArray& filteredImage = filter.Calculate();

    return filteredImage;
}

/**
 * @brief Gaussian kernel test.
 *
 */
int kernelTest()
{
    GaussianKernel kernel(1.0);
    kernel.Display();
    return 1;
}
}