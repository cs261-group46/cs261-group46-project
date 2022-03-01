from werkzeug.security import check_password_hash
from app import db
from app.models import Department, User
from app.validators.LoginValidator import validator as login_validator
from app.auth import register_login_token


def login(email: str, password: str) -> tuple:
    login_validator.validate({"email": email, "password": password})
    if login_validator.errors:
        print(login_validator.errors)
        return False, login_validator.errors, None, 401

    user = User.query.filter_by(email=email).first()
    if user is None:
        return False, {"email": "An account with the given email does not exist"}, None, 401

    if not check_password_hash(user.hashed_password, password):
        return False, {"password": "Wrong Password"}, None, 401

    return True, None, register_login_token(user), 200
