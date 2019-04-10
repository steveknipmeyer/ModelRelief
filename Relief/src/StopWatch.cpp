/**
 * @brief Class implementing a benchmark timer.
 *
 * @file StopWatch.cpp
 * @author Steve Knipmeyer
 * @date 2018-09-23
 */
#include <iostream>
#include <cmath>
#include <iomanip>

#include "ModelRelief.h"
#include "StopWatch.h"

using namespace std;

namespace ModelRelief {
    //-------------------------------------------------------------------------------------------------//
    //                                      Public                                                     //
    //-------------------------------------------------------------------------------------------------//

    /**
     * @brief Construct a new StopWatch instance.
     *
     * @param tag Functio name or timer marker.
     */
    StopWatch::StopWatch(string tag)
    {
        m_tag   = tag;
        m_start = std::clock();
    }

    /**
     * @brief Destroy a StopWatch instance.
     *
     */
    StopWatch::~StopWatch()
    {
    }

    /**
      * @brief Start the timer.
      *
      */
    void StopWatch::StopWatch::Start()
    {
        m_start = std::clock();
    }

    /**
      * @brief Stop the timer.
      *
      */
    void StopWatch::StopWatch::Stop()
    {
        double duration = (std::clock() - m_start) / (double)CLOCKS_PER_SEC;
        std::cout << m_tag << ": " << duration << '\n';
    }
}