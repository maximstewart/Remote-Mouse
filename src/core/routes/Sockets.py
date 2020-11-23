# Python imports

# Lib imports
import pyautogui
from flask import request, render_template


# App imports
from core import app, pyautogui, socketio        # Get from __init__
from core.MessageHandler import MessageHandler   # Get simple message processor




msgHandler = MessageHandler()


@app.route('/mouse-down')
@socketio.on('mouse_down', namespace='/socket.io')
def mouseDown(eve = None):
    pyautogui.mouseDown()
    return ""

@app.route('/mouse-up')
@socketio.on('mouse_up', namespace='/socket.io')
def mouseUp(eve = None):
    pyautogui.mouseUp()
    return ""


@app.route('/left-click')
@socketio.on('left_click', namespace='/socket.io')
def leftClick(eve = None):
    pyautogui.click()
    return ""

@app.route('/right-click')
@socketio.on('right_click', namespace='/socket.io')
def rightClick(eve = None):
    pyautogui.click(button='right')
    return ""

@app.route('/scroll-up')
@socketio.on('scroll_up', namespace='/socket.io')
def scrollUp(eve = None):
    pyautogui.scroll(1)
    return ""

@app.route('/scroll-down')
@socketio.on('scroll_down', namespace='/socket.io')
def scrollDown(eve = None):
    pyautogui.scroll(-1)
    return ""

@app.route('/press-enter')
@socketio.on('press_enter', namespace='/socket.io')
def pressEnter(eve = None):
    pyautogui.press("enter")
    return ""

@app.route('/press-back')
@socketio.on('press_back', namespace='/socket.io')
def pressBack(eve = None):
    pyautogui.press("backspace")
    return ""


@app.route('/update-coords/xy/<message>/<message2>')
@socketio.on('update_coords', namespace='/socket.io')
def updateCoords(message = None, message2 = None):
    try:
        parts = message.split(",")
        x     = float( parts[0] )
        y     = float( parts[1] )
        # print(str(x) + "," + str(y))
        pyautogui.moveRel(x, y);
        return ""
    except Exception as e:
        pass

    return ""
