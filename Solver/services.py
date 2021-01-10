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
from logger import Logger
from results import Results

class Services:
    """
    A class for supporting runtime services such as loggers and timers.
    """

    def __init__(self, content_folder : str, working_folder : str, logger: Logger, results: Results) -> None:
        """
        Initialize an instance of Services.
        Parameters
        ----------
        content_folder
            Absolute path to ContentRootPath.
        working_folder
            Path to the working folder for intermediate files.
        logger
            The logger instance for recording log events.
        results
            Results collection of processing results (images, meshes, workbench).

        """
        self.debug = True
        self.content_folder = content_folder
        self.working_folder = working_folder
        self.logger = logger
        self.results = results
