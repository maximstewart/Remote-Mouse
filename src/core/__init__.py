# Python imports
import os, secrets
from datetime import timedelta


# Lib imports
import eventlet
from engineio.payload import Payload

# Some fixrs for Websockets
eventlet.monkey_patch()
# eventlet.debug.hub_prevent_multiple_readers(False)
Payload.max_decode_packets = 120   # Fix too many small packets causing error


from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user, LoginManager
from flask_socketio import SocketIO


# Apoplication imports


# Configs and 'init'
ROOT_FILE_PTH = os.path.dirname(os.path.realpath(__file__))

app = Flask(__name__)
app.config.update({
                "TITLE": 'RemoteMouse',
                'DEBUG': False,
                'SECRET_KEY': secrets.token_hex(32),
                'PERMANENT_SESSION_LIFETIME': timedelta(days = 7).total_seconds()
                })


# For Websockets
socketio = SocketIO(app, async_mode = 'eventlet',
                    cors_allowed_origins = ["*"],
                    path = "socket.io",
                    allow_upgrades  = True,
                    manage_session  = True,
                    cookie = None,
                    engineio_logger = True,
                    logger = True)


from core import routes
