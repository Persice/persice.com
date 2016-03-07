import os
from PIL import Image
im = Image.open("../IMAG0320.jpg")
print im.format, im.size, im.mode

box = (100, 100, 400, 400)

outfile = im.crop(box)
outfile.save("imag0320.jpeg", "JPEG")
