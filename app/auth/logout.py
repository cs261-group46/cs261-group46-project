from flask import session
from app import User
from app.auth import remove_login_token


def logout(user: User):
    remove_login_token(user, session.get("login_token"))
    session.pop('login_token')
    return True
