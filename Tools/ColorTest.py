import sys
from tools import Colors


def main():
    """
        Main entry point.
    """
    c = Colors()
    c.print_ansi16_colors()

if __name__ == "__main__":
    print (sys.version)
    print (u"\u001b[31mHelloWorld")
    main()
