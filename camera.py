#!/usr/bin/env python3

from picamera import PiCamera
from time     import sleep

import os, time, sys

pwd = os.getcwd()
camera = PiCamera()

camera.start_preview()
sleep(2)
camera.capture(pwd + "/captures/%s.jpg" % sys.argv[1])
camera.stop_preview()
