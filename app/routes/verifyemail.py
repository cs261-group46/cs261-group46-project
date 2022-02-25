from flask import Blueprint, request, session, current_app, redirect
from app.middleware.auth import auth_required
from app.utils.auth import set_login_token
from app.utils.email_confirm_token import confirm_token
from datetime import datetime
from app import db, User


verifyemail = Blueprint("verifyemail", __name__, url_prefix="/verifyemail")

@verifyemail.route('/<token>')
def verify_email(token):
    try:
        email = confirm_token(token)
    except:
        # return {"successful": False, "warnings": ["The confirmation link is invalid or has expired."]}
        return redirect("http://localhost:3000/404")
    user = User.query.filter_by(email=email).first()

    # if user is None:
    #     return redirect("http://localhost:3000/404")

    if user.verified:
        # return {"successful": True, "alerts": ["Account already confirmed. Please login."], "redirect": "/dashboard"}

        return redirect("http://localhost:3000/setup")

    else:
        user.verified = True
        db.session.add(user)
        db.session.commit()

        set_login_token(user)

        # return {"successful": True, "infos": ["You have confirmed your account. Thanks!"], "redirect": "/dashboard"}
        return redirect("http://localhost:3000/setup")

