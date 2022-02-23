from flask import Blueprint, request, session, current_app
from app.middleware.auth import auth_required
from app.utils.email_confirm_token import confirm_token
from datetime import datetime
from app import db, User


verifyemail = Blueprint("verifyemail", __name__, url_prefix="/verifyemail")

@auth_required
@verifyemail.route('/<token>')
def verify_email(token):
    try:
        email = confirm_token(token)
    except:
        return {"successful": False, "warnings": ["The confirmation link is invalid or has expired."]}

    user = User.query.filter_by(email=email).first_or_404()

    if user.verified:
        return {"successful": True, "alerts": ["Account already confirmed. Please login."], "redirect": "/dashboard"}
    else:
        user.verified = True
        db.session.add(user)
        db.session.commit()
        return {"successful": True, "infos": ["You have confirmed your account. Thanks!"], "redirect": "/dashboard"}
