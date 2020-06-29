# Python imports

# Lib imports
import pyautogui
from flask import request, render_template


# App imports
from core import app, socketio                   # Get from __init__
from core.MessageHandler import MessageHandler   # Get simple message processor




msgHandler = MessageHandler()
TITLE      = app.config['TITLE']

pyautogui.FAILSAFE = False                       # If we hit corner, that's ok
# Let piautogui make updates as quick as it can...
pyautogui.MINIMUM_DURATION = 0
pyautogui.PAUSE = 0


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        return render_template('index.html',
                                title=TITLE)

    return render_template('error.html',
                            title='Error!',
                            message='Must use GET request type...')


@app.route('/single-click', methods=['GET', 'POST'])
def singleClick():
    pyautogui.click()
    return ""

@app.route('/double-click', methods=['GET', 'POST'])
def doubleClick():
    pyautogui.doubleClick()
    return ""

@app.route('/get-coords', methods=['GET', 'POST'])
def getCoords():
    x, y = pyautogui.position();
    return '{"x": "'+ str(x) +'", "y":"' + str(y) + '"}'


@socketio.on('update_coords')
def updateCoords(message):
    try:
        parts = message.split(",")
        x     = float( parts[0] )
        y     = float( parts[1] )
        # print(str(x) + "," + str(y))
        pyautogui.moveRel(x, y);
    except Exception as e:
        print( repr(e) )

@app.route('/update-coords/xy/<x>/<y>')
def updateCoords2(x, y):
    try:
        # print(x + "," + y)
        pyautogui.moveRel(float(x), float(y));
        return "{}"
    except Exception as e:
        print( repr(e) )
        return render_template('error.html',
                                title='Error!',
                                message='Key is not a valid input...')


@app.route('/send-key', methods=['GET', 'POST'])
def sendKey():
    pyautogui.doubleClick()
    if request.method == 'POST':
        try:
            text = str(request.values['text']).strip()
            pyautogui.typewrite(text);

            # print("\nX: {}  Y: {}".format(str(x), str(y)))
            # pyautogui.typewrite('Hello world!\n', interval=secs_between_keys)  # useful for entering text, newline is Enter
            # pyautogui.press(['left', 'left', 'left', 'left']) # Press the left arrow key 4 times.
            # pyautogui.keyDown('shift') # Press the Shift key down and hold it.
            # pyautogui.keyUp('shift')   # Let go of the Shift key.
        except Exception as e:
            print( repr(e) )
            return render_template('error.html',
                                    title='Error!',
                                    message='Key is not a valid input...')

    return render_template('error.html',
                            title='Error!',
                            message='Must use POST request type...')
