from flask import Blueprint, request, session
from app import db, login_token_key_str, Users


users = Blueprint("api_users", __name__, url_prefix="/user")

@users.route("/", methods=["GET"])
def get():
    if login_token_key_str in session.keys():
        user = Users.GetBy.login_token(db, session.get(login_token_key_str))
        if user.isLoaded():
            return user.get_api_return_data()
        return {}

