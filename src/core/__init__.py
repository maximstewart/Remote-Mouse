# Python imports
import secrets


# Lib imports
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user, LoginManager


# Apoplication imports


# Configs and 'init'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///static/db/database.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TITLE'] = 'RemoteMouse'

# For csrf and some other stuff...
app.config['SECRET_KEY'] = secrets.token_hex(32)


login_manager = LoginManager(app)
bcrypt        = Bcrypt(app)

from core.models import db, User
db.init_app(app)

from core.forms import RegisterForm, LoginForm
from core import routes
