import colorama
import sys
from Tools import Colors


def main():
    """
        Main entry point.
    """
    c = Colors()
    c.print_ansi16_colors()

if __name__ == "__main__":
    colorama.init()
    print (sys.version)
    print (u"\u001b[31mHelloWorld")
    main()
