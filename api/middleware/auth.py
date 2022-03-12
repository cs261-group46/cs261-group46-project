from functools import wraps

from flask import session, current_app
from api.models.User import User
import jwt
from datetime import datetime
from api.utils.auth import get_login_token_timeout, set_login_token


def verify_auth(f, required_permission_level, *args, **kwargs):
    if not (token := session.get("login_token")):
        if required_permission_level == -1:
            return f(user=None, *args, **kwargs)
        return {'success': False, 'errors': ['Auth token seems to be missing. Try to login again.']}, 401

    try:
        # decoding the payload to fetch the stored details
        data = jwt.decode(
            token, current_app.config['SECRET_KEY'], algorithms="HS256")

        if datetime.fromtimestamp(data['exp']) < datetime.utcnow():
            session.pop("login_token")
            if required_permission_level == -1:
                return f(user=None, *args, **kwargs)
            return {'success': False, 'errors': ['Auth token seems to be expired.']}, 401

        current_user = User.query.filter_by(id=data['user_id']).first()

        if current_user.permissions < required_permission_level:
            return {'success': False, 'errors': ['You do not have the permissions to access this resource']}, 401

        set_login_token(current_user)

    except:
        session.pop("login_token")
        if required_permission_level == -1:
            return f(user=None, *args, **kwargs)
        return {'success': False, 'errors': ['Auth token seems to be invalid. Try to login again.']}, 401
        # returns the current logged in users contex to the routes
    return f(user=current_user, *args, **kwargs)


# https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
def auth_required(*auth_req_args, required_permission_level=0):
    def decorator(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            # You probably don't need to separate it into another function, but i wanted to keep the signature
            return verify_auth(func, required_permission_level_final, *args, **kwargs)
        return decorated

    f = None
    required_permission_level_final = None

    if len(auth_req_args) > 0:
        if hasattr(auth_req_args[0], "__call__"):
            # Is a function
            f = auth_req_args[0]
        elif isinstance(auth_req_args[0], int):
            if required_permission_level == 0:
                required_permission_level_final = auth_req_args[0]

    if not required_permission_level_final:
        required_permission_level_final = required_permission_level

    if f:
        return decorator(f)
    else:
        return decorator
