import os
from PIL import Image
im = Image.open("../IMAG0320.jpg")
print im.format, im.size, im.mode

size = (128, 128)

outfile = "imag0320.thumbnail"
im.thumbnail(size)
im.save(outfile, "JPEG")
im.save(outfile, "JPEG")
