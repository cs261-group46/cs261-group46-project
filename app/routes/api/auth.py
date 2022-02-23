import datetime

from flask import Blueprint, request, session, current_app, url_for, render_template

from app.utils.email import send_email
from app.validators.RegistrationValidator import validator as registration_validator
from app.validators.LoginValidator import validator as login_validator

# from app.models import User
from app import db, User, Department
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from app.utils.auth import get_login_token_timeout
from app.utils.email_confirm_token import generate_confirmation_token
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
    department_not_exists = Department.query.filter_by(id=data.get("department").get('id'), name=data.get("department").get('label')).first() is None

    if department_not_exists:
        return {
            "successful": False,
            "errors": {"department": "The selected department doesn't exist"}
        }

    password_hash = generate_password_hash(password=data.get("password"))

    new_user = User(
        email=data.get("email"),
        hashed_password=password_hash,
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        department_id=data.get("department").get("id"),
    )

    db.session.add(new_user)
    db.session.commit()

    login_token = jwt.encode({
        'user_id': new_user.id,
        'exp': get_login_token_timeout()
    }, current_app.config['SECRET_KEY'])

    session['login_token'] = login_token

    token = generate_confirmation_token(new_user.email)

    verify_url = url_for('verifyemail.verify_email', token=token, _external=True)
    html = render_template(
        'emails/verify_email.html',
        user={
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "email": new_user.email
        },
        verify_url = verify_url
    )

    subject = "Please confirm your email"

    send_email(new_user.email, subject, html)

    return {"successful": True}


# @user_blueprint.route('/confirm/<token>')
# @login_required
# def confirm_email(token):
#     try:
#         email = confirm_token(token)
#     except:
#         flash('The confirmation link is invalid or has expired.', 'danger')
#     user = User.query.filter_by(email=email).first_or_404()
#     if user.confirmed:
#         flash('Account already confirmed. Please login.', 'success')
#     else:
#         user.confirmed = True
#         user.confirmed_on = datetime.datetime.now()
#         db.session.add(user)
#         db.session.commit()
#         flash('You have confirmed your account. Thanks!', 'success')
#     return redirect(url_for('main.home'))


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
