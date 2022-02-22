from flask import Blueprint, request, session, redirect
from app.auth import auth_required, send_verification_email, get_user_from_email_verification_token

# from app.utils import create_validation_token, verify_validation_token
from app import db, User

blueprint = Blueprint("verification_register", __name__, url_prefix="/register")


@blueprint.route("/request_email")
@auth_required
def request_email(user: User):
    send_verification_email(user)
    return {"successful": True}


@blueprint.route("/<token_value>")
@auth_required
def token(session_user: User, token_value: str):
    token_user = get_user_from_email_verification_token(token_value)

    if token_user is not None:

        if session_user.id == token_user.id:
            session_user.verified = True
            db.session.commit()

            print(f"Validated {session_user!r}")
            return redirect("/dashboard")

    return redirect("/verification_error/InvalidToken")
