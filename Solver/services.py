#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Services
   :synopsis: Support for runtime services.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from stopwatch import StopWatch

class Services:
    """
    A class for supporting runtime services such as loggers and timers.
    """

    def __init__(self, working_folder : str, logger):
        """
        Initialize an instance of Services.
        Parameters
        ----------
        working_folder
            Path to the working folder for intermediate files.
        logger
            The logger instance for recording log events.
        
        """
        self.debug = True
        self.working_folder = working_folder
        self.logger = logger
        self.stopwatch = StopWatch(self.logger)


