from flask import request, session, current_app
from functools import wraps
from app.auth import get_user_from_login_token


def verify_auth_required(required_permission_level, func, *args, **kwargs):
    if not (token := session.get("login_token")):
        return {'error': 'Authentication token missing. Please login.'}, 401

    current_user = get_user_from_login_token(token)

    if current_user is None:
        session.pop("login_token")
        return {'error': 'Auth token seems to be expired.'}, 401

    if current_user.permission_level < required_permission_level:
        return {'error': 'You do not have the permissions to access this resource'}, 401

    # returns the current logged in users contex to the routes
    return func(current_user, *args, **kwargs)


def auth_required(*args, **kwargs):
    """
    Because flask was throwing an error relating to here, and because we can call the decorator in different ways, this weirdness had to occur
    :param args:
    :param kwargs:
    :return:
    """
    if "required_permission_level" in kwargs:
        required_permission_level = kwargs["required_permission_level"]
    else:
        required_permission_level = 0
    if len(args) == 0:
        # We called the function, not flask, so we have a different structure
        def decorator(f):
            def decorated_function(*args_df, **kwargs_df):
                return verify_auth_required(required_permission_level, f, *args_df, **kwargs_df)
            return decorated_function
        return decorator
    else:
        f = args[0]
        @wraps(f)
        def decorated_function(*args_df, **kwargs_df):
            return verify_auth_required(required_permission_level, f, *args_df, **kwargs_df)

        return decorated_function


