/**
 * @brief Class implementing a benchmark timer.
 *
 * @file StopWatch.h
 * @author Steve Knipmeyer
 * @date 2018-09-23
 */
#pragma once
#include <iostream>
#include <cmath>
#include <iomanip>

#include "ModelRelief.h"

namespace ModelRelief {
/**
    * @brief Class implementing a benchmark timer.
    *
    */
class StopWatch {
    private:
        std::string m_tag;
        std::clock_t m_start;

    public:
        StopWatch(std::string tag);
        ~StopWatch();

        void Start();
        void Stop();
};
}