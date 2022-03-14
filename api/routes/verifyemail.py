from flask import Blueprint, redirect
from api.utils.auth import set_login_token
from api.utils.email_confirm_token import confirm_token
from api.models import User
from flask import current_app

verifyemail = Blueprint("verifyemail", __name__, url_prefix="/verifyemail")


@verifyemail.route('/<token>')
def verify_email(token):
    try:
        email = confirm_token(token)
    except:
        # return {"successful": False, "warnings": ["The confirmation link is invalid or has expired."]}
        return redirect(f"{current_app.config.get('SERVER')}/")

    try:
        user = User.query.filter_by(email=email).first()
    except:
        return redirect(f"{current_app.config.get('SERVER')}/")

    if user.verified:
        return redirect(f"{current_app.config.get('SERVER')}/dashboard")

    else:
        user.verified = True
        user.commit()

        set_login_token(user)

        return redirect(f"{current_app.config.get('SERVER')}/setup")

