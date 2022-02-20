from flask import Blueprint, request, session
from app import db, login_token_key_str, Users
import app.utils as Utils


mentors = Blueprint("api_mentors", __name__, url_prefix="/mentor")


@mentors.route("/register", methods=["POST"])
def register():
    return {}


@mentors.route("/", methods=["GET"])
def get():
    if login_token_key_str in session.keys():
        user = Users.GetBy.login_token(db, session.get(login_token_key_str))
        if user.isLoaded():
            return {"mentors": Utils.to_api_return_data(Users.Mentors.GetBy.user(db, user))}
    return []
