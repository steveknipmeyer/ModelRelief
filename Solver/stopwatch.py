#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Services
   :synopsis: A performance timer.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
import time
from decimal import Decimal

class TimerEntry:
    """
    A class representing an event entry in the timer stack.
    """

    def __init__(self, start_time : float, indent : str):
        """
        Initialize an instance of a TimerEntry.
        Parameters
        ----------
        start_time 
            The start time of a timer event.
        indent
            The indentation prefix (N spaces) for the timer event.
        """
        self.start_time = start_time
        self.indent     = indent    

class StopWatch:
    """
    A class for performance timing.
    """
    PRECISION = '1.00'

    def __init__(self, logger):
        """
        Initialize an instance of a StopWatch.
        Parameters
        ----------
        logger
            The logger instance for recording timer events.
        """
        self.logger = logger

        self.events = {}

    def eventCount (self) -> int: 
        """Returns the mumber of pending events."""
        return int(len(self.events.keys()))

    def indent_prefix(self) -> str:
        """ Returns the current indentation level. """
        indent = "    "
        return indent * int(self.eventCount())

    def mark(self, event : str) -> str:
        """ Adds an event to the timer stack. """
        start_time = time.time()
        indent = self.indent_prefix()
        timer_entry = TimerEntry(start_time, indent)
        self.events[event] = timer_entry

        self.logger("%s%s" % (indent, event))

        return event

    def log_time(self, event : str):
        """Logs the elapsted time."""
        current_time = time.time()
        event_time = current_time - self.events[event].start_time

        # https://stackoverflow.com/questions/45136821/how-to-convert-float-to-fixed-point-decimal-in-python
        event_time_rounded =  Decimal(event_time).quantize(Decimal(self.PRECISION))
        indent_prefix = self.events[event].indent

        self.logger("%s%s : %s sec" % (indent_prefix, event, event_time_rounded))

        # remove dictionary key
        self.events.pop(event)
