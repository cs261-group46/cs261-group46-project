from flask import Blueprint, request, session, url_for, render_template

from api.utils.cerberus_helpers import get_errors
from api.utils.email import send_email
from api.validators.AuthValidators import loginValidator, registerValidator
from api.models import User, Department
from werkzeug.security import generate_password_hash, check_password_hash
from api.utils.auth import set_login_token
from api.utils.email_confirm_token import generate_confirmation_token
from api.middleware.auth import auth_required
from flask import current_app

auth = Blueprint("api_auth", __name__, url_prefix="/auth")


@auth.route("/register/", methods=["POST"])
def register():
    try:
        data = dict(request.get_json())
        # validate structure of request
        registerValidator.validate(data)
        if registerValidator.errors:
            return {
                "success": False,
                "errors": get_errors(registerValidator)
            }, 400

        # check whether email is repeated
        is_email_repeated = not User.query.filter_by(email=data.get("email")).first() is None
        if is_email_repeated:
            return {
                "success": False,
                "errors": ["An account with the given email already exists"]
            }, 400

        # check whether department exists
        department_not_exists = Department.query.filter_by(id=data.get("department").get('id'), name=data.get("department").get('name')).first() is None

        if department_not_exists:
            return {
                "success": False,
                "errors": ["The selected department doesn't exist"]
            }, 400

        password_hash = generate_password_hash(password=data.get("password"))

        new_user = User(
            email=data.get("email"),
            hashed_password=password_hash,
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            department_id=data.get("department").get("id"),
        ).commit()

        token = generate_confirmation_token(new_user.email)

        # verify_url = url_for('verifyemail.verify_email', token=token, _external=True)
        verify_url = f'{current_app.config.get("SERVER")}/verifyemail/{token}'
        html = render_template(
            'emails/verify_email.html',
            user={
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "email": new_user.email
            },
            verify_url=verify_url
        )
        subject = "Please confirm your email"
        send_email(new_user.email, subject, html)

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@auth.route("/login/", methods=["POST"])
def login():
    # try:
        data = dict(request.get_json())
        loginValidator.validate(data)
        if loginValidator.errors:
            return {
                "success": False,
                "errors":  get_errors(loginValidator)
            }, 400

        # check whether email is repeated
        email_doesnt_exists = User.query.filter_by(email=data.get("email")).first() is None
        if email_doesnt_exists:
            return {
                "success": False,
                "errors": ["An account with the given email doesn't exist"]
            }, 400

        user = User.query.filter_by(email=data.get("email")).first()
        if not check_password_hash(user.hashed_password, data.get("password")):
            return {
                "success": False,
                "errors": ["The given password is incorrect"]
            }, 400

        set_login_token(user)

        return {"success": True}, 200
    # except:
    #     return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@auth.route("/logout/", methods=["GET"])
@auth_required
def logout(user: User):
    try:
        session.pop('login_token')
        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

