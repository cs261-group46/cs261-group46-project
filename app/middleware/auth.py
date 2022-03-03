from functools import wraps

from flask import request, jsonify, session, current_app
from app import User
import jwt
from datetime import datetime
from app.utils.auth import get_login_token_timeout, set_login_token


# # TODO : REFACOTOR THIS SO THE DECORATOR USES IT
# def verify_auth(required_permission_level):
#     token = None
#     # jwt is passed in the request header
#     if 'login_token' in session:
#         token = session['login_token']
#     # return 401 if token is not passed
#
#     if not token:
#         return False
#
#     try:
#         data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms="HS256")
#
#         if datetime.fromtimestamp(data['exp']) < datetime.utcnow():
#             session.pop("login_token")
#             return False
#
#         current_user = User.query.filter_by(id=data['user_id']).first()
#
#         if current_user.permissions < required_permission_level:
#             return False
#
#         set_login_token(current_user)
#
#         return True
#
#     except:
#         session.pop("login_token")
#         return False


# https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
def auth_required(required_permission_level=0):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            # jwt is passed in the request header
            if 'login_token' in session:
                token = session['login_token']
            # return 401 if token is not passed
            if not token:
                if required_permission_level == -1:
                    return f(user=None, *args, **kwargs)
                return {'success': False, 'errors': ['Auth token seems to be missing. Try to login again.']}, 401

            try:
                # decoding the payload to fetch the stored details
                data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms="HS256")

                if datetime.fromtimestamp(data['exp']) < datetime.utcnow():
                    session.pop("login_token")
                    if required_permission_level == -1:
                        return f(user=None, *args, **kwargs)
                    return {'success': False, 'errors': ['Auth token seems to be expired.']}, 401

                current_user = User.query.filter_by(id=data['user_id']).first()

                if current_user.permissions < required_permission_level:
                    return {'success': False, 'errors': ['You do not have the permissions to access this resource']}, 401

                login_token = jwt.encode({
                    'user_id': current_user.id,
                    'exp': get_login_token_timeout()
                }, current_app.config['SECRET_KEY'])

                session['login_token'] = login_token

            except:
                session.pop("login_token")
                if required_permission_level == -1:
                    return f(user=None, *args, **kwargs)
                return {'success': False, 'errors': ['Auth token seems to be invalid. Try to login again.']}, 401
            # returns the current logged in users contex to the routes
            return f(user=current_user, *args, **kwargs)
        return decorated
    return decorator
