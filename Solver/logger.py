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

    def __init__(self):
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

    def logMessage(self, messageClass : MessageClass, message : str) :
        """
        Logs a message.
        """
        finalMessage = "{}{}{}".format(self.colors[messageClass], message, Colors.Reset)
        print (finalMessage)

    def logDebug(self, message : str) :
        """
        Logs a Debug class message.
        """
        self.logMessage(MessageClass.DEBUG, message)

    def logInformation(self, message : str) :
        """
        Logs an Inforration class message.
        """
        self.logMessage(MessageClass.INFORMATION, message)

    def logWarning(self, message : str) :
        """
        Logs a Warning class message.
        """
        self.logMessage(MessageClass.WARNING, message)

    def logError(self, message : str) :
        """
        Logs an Error class message.
        """
        self.logMessage(MessageClass.ERROR, message)

    def logTimer(self, message : str) :
        """
        Logs a Timer class message.
        """
        self.logMessage(MessageClass.TIMER, message)
