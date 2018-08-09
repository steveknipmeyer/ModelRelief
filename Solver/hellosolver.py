import os

def hello():
    name = os.getenv("NAME", "default name")
    print (f'hello, {name}')

if __name__ == "__main__":
   hello()