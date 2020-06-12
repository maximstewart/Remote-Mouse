# Python imports
import secrets


# Lib imports
import eventlet

from engineio.payload import Payload


from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user, LoginManager
from flask_socketio import SocketIO


# Apoplication imports


# Configs and 'init'
app = Flask(__name__)
app.config['TITLE'] = 'RemoteMouse'
app.config['SECRET_KEY'] = secrets.token_hex(32)   # For csrf and some other stuff...

# For Websockets
# eventlet.monkey_patch()
Payload.max_decode_packets = 120   # Fix too many small packets causing error
socketio = SocketIO(app, async_mode='eventlet')

from core import routes
