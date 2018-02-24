#!/usr/bin/env python3

from picamera import PiCamera
from time     import sleep

import os
import time

pwd = os.getcwd()
timestamp = int(time.time())
camera = PiCamera()

camera.start_preview()
sleep(2)
camera.capture(pwd + "/captures/%s.jpg" % timestamp)
camera.stop_preview()
