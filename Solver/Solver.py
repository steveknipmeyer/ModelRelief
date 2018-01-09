import os.path
import numpy as np
import matplotlib.pylab as plt

currentDirectory = os.path.dirname(__file__)
fileName = os.path.join(currentDirectory, "Lucy.png");

im = plt.imread(fileName)

print(im.shape)

def plti(im, h=8, **kwargs):
    """
    Helper function to plot an image.
    Dimensions are in centimeters.
    """
    y = im.shape[0]
    x = im.shape[1]
    aspectRatio = y/x
    w = aspectRatio * h
    print ('Aspect ratio = {}'.format(aspectRatio))
    print ("w = {}, h = {}".format (w, h))
    
    plt.figure(figsize=(w, h))
    plt.imshow(im, interpolation="none", **kwargs)
    plt.axis('off')

plti(im, 5)

plt.plot([1,2,3,4])
plt.ylabel('some numbers')
plt.show()
