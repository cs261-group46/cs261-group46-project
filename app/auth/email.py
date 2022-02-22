from flask import url_for

from app import Mail, MailRegister, User
from app.auth import register_email_verification_token


def send_verification_email(user: User):
    print("\n\n\t\tUser Verification Email")
    MailRegister.VERIFY.send([user.email],
                             user=user,
                             password_reset_redirect_link="/reset_password",
                             verify_url=f"/verification/register/{(validation_token := register_email_verification_token(user))}")
    print(url_for("verification.verification_register.token", token=validation_token, _external=True))


def send_password_reset_email(user: User):
    print("\n\n\t\tPassword Reset Email")
    MailRegister.RESET.send([user.email],)
    # print(url_for("verification.verification_register.token", token=validation_token, _external=True))