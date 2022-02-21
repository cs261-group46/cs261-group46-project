from flask import Blueprint, request, session, redirect
from uuid import UUID

from itsdangerous import SignatureExpired

# from app.utils import create_validation_token, verify_validation_token
from app import db, login_token_key_str

from app.user import auth
from app.models import Users
import app.environ as environ


secret_key = environ.get("SECRET_KEY")
blueprint = Blueprint("verification_register", __name__, url_prefix="/register")


@blueprint.route("/request_email")
def request_email():
    if (user := Users.session(login_token_key_str, session).first()) is None:
        return "Not Logged in"
    user.send_verify_email(db)
    return "Sent"


@blueprint.route("/<token>")
def token(token: str):
    valid = False
    errors = []

    r_method = None

    if (token_user := Users.select(email_verify_token=token).first()) is None:
        errors.append("Token.Invalid")
        r_method = redirect("/verification_error/InvalidToken")  # Can have timed out or just be wrong

    if (session_user := Users.session(login_token_key_str, session).first()) is None:
        errors.append("User.NotLoggedIn")
        r_method = redirect("/verification_error/NotConnected")  # The user needs to login
        # return redirect("/login")  # The user must login, this should be used with a notification being flashed on the user's screen

    if token_user is not None and session_user is not None:
        if token_user.unique_user_id == session_user.unique_user_id:
            # verify
            valid = True
            r_method = redirect("/dashboard")
        else:
            errors.append("User.Incorrect")
            r_method = redirect("/verification_error/InvalidToken")  # Wrong token


    if valid:
        statement = f" UPDATE users SET verified=true WHERE id={session_user.id}"
        cursor = db.cursor()
        cursor.execute(statement)

        session_user.verified = True
        token_user.verified = True


    print(f"{valid} {errors} {session_user!r} {token_user!r}")
    return r_method
