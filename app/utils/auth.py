from app.utils.strings import generate_random_string
from datetime import datetime, timedelta


# def generate_login_token(length: int = 128) -> str:
#     while True:
#         login_token = generate_random_string(length)
#         if not LoginToken.query.filter_by(login_token=login_token):
#             break
#     return login_token


def get_login_token_timeout():
    return datetime.utcnow() + timedelta(minutes=30)

# def refresh_token(login_token):
#