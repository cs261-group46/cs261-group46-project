import datetime

from flask import Blueprint, request, session, current_app
from app.validators.RegistrationValidator import validator as registration_validator
from app.validators.LoginValidator import validator as login_validator

# from app.models import User
from app import db, User, Department
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from app.utils.auth import get_login_token_timeout
import jwt
from app.middleware.auth import auth_required


auth = Blueprint("api_auth", __name__, url_prefix="/auth")


@auth.route("/register", methods=["POST"])
def register():

    data = dict(request.get_json())

    # validate structure of request
    registration_validator.validate(data)
    if registration_validator.errors:
        return {
            "successful": False,
            "errors": registration_validator.errors
        }

    # check whether email is repeated
    email_repeated = not User.query.filter_by(email=data.get("email")).first() is None
    if email_repeated:
        return {
            "successful": False,
            "errors": {"email": "An account with the given email already exists"}
        }

    # check whether department exists
    department_not_exists = Department.query.filter_by(id=data.get("department")).first() is None
    if department_not_exists:
        return {
            "successful": False,
            "errors": {"department": "The selected department doesn't exist"}
        }

    password_hash = generate_password_hash(password=data.get("password"))

    while True:
        new_id = uuid4()
        if User.query.filter_by(id=new_id) is None:
            break

    new_user = User(
        id=new_id,
        email=data.get("email"),
        hashed_password=password_hash,
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        department_id=data.get("department"),
    )

    db.session.add(new_user)
    db.session.commit()

    login_token = jwt.encode({
        'user_id': new_user.id,
        'exp': get_login_token_timeout()
    }, current_app.config['SECRET_KEY'])

    session['login_token'] = login_token

    return {"successful": True}


@auth.route("/login", methods=["POST"])
def login():
    data = dict(request.get_json())

    login_validator.validate(data)
    if login_validator.errors:
        return {
            "successful": False,
            "errors": login_validator.errors
        }

    # check whether email is repeated
    email_doesnt_exists = User.query.filter_by(email=data.get("email")).first() is None
    if email_doesnt_exists:
        return {
            "successful": False,
            "errors": {"email": "An account with the given email doesn't exist exists"}
        }

    user = User.query.filter_by(email=data.get("email")).first()
    if not check_password_hash(user.hashed_password, data.get("password")):
        return {
            "successful": False,
            "errors": {"password": "Password seems to be wrong"}
        }

    login_token = jwt.encode({
        'user_id': user.id,
        'exp': get_login_token_timeout()
    }, current_app.config['SECRET_KEY'])

    session['login_token'] = login_token

    return {"successful": True}


@auth.route("/logout", methods=["POST"])
@auth_required
def logout():
    session.pop('login_token')
    return {"successful": True}

# logout route
