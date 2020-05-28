from flask_sqlalchemy import SQLAlchemy
from core import app, login_manager
from flask_login import UserMixin


db = SQLAlchemy(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    username = db.Column(db.String, unique=True, nullable=False)
    email    = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    id       = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)

    def __repr__(self):
        return f"['{self.username}', '{self.email}', '{self.password}', '{self.id}']"
