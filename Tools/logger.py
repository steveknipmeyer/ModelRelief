#!/usr/bin/env python
#
#   Copyright (c) 2018
#   All Rights Reserved.
#

"""
.. module:: Logger
   :synopsis: Support for runtime logging.

.. moduleauthor:: Steve Knipmeyer <steve@knipmeyer.org>
"""
from enum import Enum

from tools import Colors

class MessageClass(Enum):
    """
    A class representing the various levels of log messages.
    """
    DEBUG = 1
    INFORMATION = 2
    WARNING = 3
    ERROR = 4
    TIMER = 5

class Logger:
    """
    A class for supporting runtime logging.
    """

    def __init__(self) -> None:
        """
        Initialize an instance of the Logger.
        """
        self.colors = {
            MessageClass.DEBUG : Colors.BrightMagenta,
            MessageClass.INFORMATION : Colors.BrightWhite,
            MessageClass.WARNING : Colors.BrightYellow,
            MessageClass.ERROR : Colors.BrightRed,
            MessageClass.TIMER : Colors.BrightCyan,
        }

    def logColorMessage(self, message : str, color: str):
        """
        Logs a message with a color attribute.
        """
        colorMessage = "{}{}{}".format(color, message, Colors.Reset)
        print (colorMessage)

    def logMessage(self, messageClass : MessageClass, message : str, color_override : str = None):
        """
        Logs a message.
        """
        color = self.colors[messageClass] if color_override is None else color_override
        self.logColorMessage(message, color)

    def logDebug(self, message : str, color_override : str = None):
        """
        Logs a Debug class message.
        """
        self.logMessage(MessageClass.DEBUG, message, color_override)

    def logInformation(self, message : str, color_override : str = None):
        """
        Logs an Information class message.
        """
        self.logMessage(MessageClass.INFORMATION, message, color_override)

    def logWarning(self, message : str, color_override : str = None):
        """
        Logs a Warning class message.
        """
        self.logMessage(MessageClass.WARNING, message, color_override)

    def logError(self, message : str, color_override : str = None):
        """
        Logs an Error class message.
        """
        self.logMessage(MessageClass.ERROR, message, color_override)

    def logTimer(self, message : str, color_override : str = None):
        """
        Logs a Timer class message.
        """
        self.logMessage(MessageClass.TIMER, message, color_override)
