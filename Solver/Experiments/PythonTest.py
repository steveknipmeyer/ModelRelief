#!/usr/bin/env python

class Widget:

    factory = 'Asia'
    def __init__ (self, name: str, cost: float) -> None:
        self.name = name
        self.cost = cost

    def show_properties(self):
        print (f'The widget {self.name} has a cost of ${self.cost} and is manufactured in {Widget.factory}')

def main():   
    w1 = Widget('Flitter', 10.0)
    w2 = Widget('Dimper',  20.0)

    w1.show_properties()

if __name__ == '__main__':
    main()