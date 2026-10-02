from PIL import Image

# Open the image
img = Image.open('client/public/payment-qr.jpg')
width, height = img.size

# The QR code is a square in the middle of the screenshot
# Let's crop a square in the center, slightly shifted up
crop_size = 320
left = (width - crop_size) / 2
upper = (height - crop_size) / 2 - 50 # shift up by 50px
right = left + crop_size
lower = upper + crop_size

cropped = img.crop((left, upper, right, lower))
cropped.save('client/public/cropped-qr.jpg')
print("Cropped image saved.")
