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

class Services:
    """
    A class for supporting runtime services such as loggers and timers.
    """

    def __init__(self, root_folder : str, working_folder : str, logger) -> None:
        """
        Initialize an instance of Services.
        Parameters
        ----------
        root_folder
            Absolute path to web root.
        working_folder
            Path to the working folder for intermediate files.
        logger
            The logger instance for recording log events.
        
        """
        self.debug = True
        self.root_folder = root_folder
        self.working_folder = working_folder
        self.logger = logger


