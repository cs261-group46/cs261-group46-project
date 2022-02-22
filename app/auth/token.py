import jwt
from flask import current_app, session
from datetime import datetime

from app import db, User, TokenType, Token, LOGIN, EMAIL_VERIFY, PASSWORD_RESET
from app.utils import random_string


def register_jwt(user: User, token_type: TokenType):
    return jwt.encode({
        "user_id": user.id,
        "type": token_type.id,
        "exp": token_type.get_timeout()
    }, current_app.config["SECRET_KEY"])


def register_token(user: User, token_type: TokenType) -> str:

    token_value = get_available_token()

    # token_type = TokenType.token_types_name[token_type_name]
    # token_type_data = TokenType.query.filter_by(name=token_type_name)
    # token_type = token_type_data.first()

    token = Token(user_id=user.id, value=token_value, type=token_type.id, timeout_timestamp=token_type.get_timeout())

    db.session.add(token)
    db.session.commit()
    return token_value


def get_user_from_jwt(token_value: str, token_type: TokenType):
    try:
        # decoding the payload to fetch the stored details
        data = jwt.decode(token_value, current_app.config['SECRET_KEY'])
        if data["exp"] < datetime.utcnow():
            return None

        if data["type"] != token_type.id:
            return None

        current_user = User.query.filter_by(id=data['user_id']).first()

        login_token = register_jwt(current_user, token_type)
        session['login_token'] = login_token

        return current_user
    except:
        return None


def get_user_from_token(token_value: str, token_type: TokenType) -> User | None:

    # token_type_data = TokenType.query.filter_by(name=token_type_name)
    # token_type = token_type_data.first()

    token_data = Token.query.filter_by(value=token_value, type=token_type.id)
    token = token_data.first()

    if not token:
        return None

    # timeout_time, refresh_on_access, single_use = token_type.timeout_time, token_type.refresh_on_access, token_type.single_use
    # token_id, user_id, timeout = token.id, token.user_id, token.timeout_timestamp

    if token.timeout_timestamp < datetime.utcnow():
        # Expired token
        token_data.delete()
        # db.session.delete(token)
        return None

    user = User.query.filter_by(id=token.user_id).first()

    if token_type.single_use:
        token_data.delete()
    elif token_type.refresh_on_access:
        token.timeout_timestamp = token_type.get_timeout()  #  datetime.utcnow()+timedelta(minutes=token_type.timeout_time)
        # db.session.execute(update(Token).where(Token.c.id==token_id).values(timeout_timestamp=datetime.utcnow()+timedelta(minutes=timeout_time)))

    db.session.commit()
    return user


def remove_jwt(user: User, token_value: str, token_type: TokenType):
    return True


def remove_token(user: User, token_value: str, token_type: TokenType):
    token_data = Token.query.filter_by(user_id=user.id, value=token_value, type=token_type.id)
    token_data.delete()
    db.session.commit()

    return True


def get_available_token() -> str:
    while Token.query.filter_by(value=(token_value := random_string(128))).first():
        continue
    return token_value
    # if not Token.query.filter_by(value=(token_value := random_string(128))).first():
    #     break


def register_login_token(user: User) -> str:
    return register_token(user, LOGIN)


def register_email_verification_token(user: User) -> str:
    return register_token(user, EMAIL_VERIFY)


def register_password_reset_token(user: User) -> str:
    return register_token(user, PASSWORD_RESET)


def get_user_from_login_token(token_value: str) -> User:
    return get_user_from_token(token_value, LOGIN)


def get_user_from_email_verification_token(token_value: str) -> User:
    return get_user_from_token(token_value, EMAIL_VERIFY)


def get_user_from_password_reset_token(token_value: str) -> User:
    return get_user_from_token(token_value, EMAIL_VERIFY)


def remove_login_token(user: User, token_value: str):
    return remove_token(user, token_value, LOGIN)


def remove_email_verification_token(user: User, token_value: str):
    return remove_token(user, token_value, EMAIL_VERIFY)


def remove_password_reset_token(user: User, token_value: str):
    return remove_token(user, token_value, PASSWORD_RESET)
