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


@app.route('/send-keys', methods=['GET', 'POST'])
def sendKeys():
    if request.method == 'POST':
        try:
            text = str(request.values['text']).strip()
            pyautogui.typewrite(text);
        except Exception as e:
            print( repr(e) )
            return render_template('error.html',
                                    title='Error!',
                                    message='Key is not a valid input...')

    return render_template('error.html',
                            title='Error!',
                            message='Must use POST request type...')
