from datetime import datetime, timedelta
import jwt
from flask import current_app, session


def get_login_token_timeout():
    return datetime.utcnow() + timedelta(minutes=60)


def set_login_token(user):
    login_token = jwt.encode({
        'user_id': user.id,
        'exp': get_login_token_timeout()
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    session['login_token'] = login_token