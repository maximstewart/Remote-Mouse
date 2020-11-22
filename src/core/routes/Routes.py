# Python imports
import subprocess

# Lib imports
import pyautogui
from flask import request, render_template


# App imports
from core import app, pyautogui, socketio        # Get from __init__
from core.MessageHandler import MessageHandler   # Get simple message processor


msgHandler = MessageHandler()


@app.route('/')
def home():
    if request.method == 'GET':
        return render_template('index.html')

    return render_template('error.html',
                            title='Error!',
                            message='Must use GET request type...')


@app.route('/sound-manager')
def soundManager():
    if request.method == 'GET':
        # command = 'runuser -l abaddon bash -c "pacmd list-sink-inputs"'
        command = 'sudo -u abaddon bash -c "pacmd list-sink-inputs"'
        # command = 'sudo -u abaddon bash <<EOF pacmd list-sink-inputs EOF'
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
        result = process.wait()
        print(process.stdout.read())
        _apps = []
        return render_template('sound-manager.html',
                                apps=_apps)

    return render_template('error.html',
                            title='Error!',
                            message='Must use GET request type...')



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


@app.route('/send-keys', methods=['GET', 'POST'])
def sendKeys():
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
