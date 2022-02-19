from flask import Blueprint, request, session
from app import db, login_token_key_str  # , Users
import app.user as Users
import app.user.mentor as Mentors
import app.user.mentee as Mentees
import app.utils as Utils


blueprint = Blueprint("api_mentees", __name__, url_prefix="/mentee")


@blueprint.route("/register", methods=["POST"])
def register():
    return {}


@blueprint.route("/", methods=["GET"])
def get():
    if login_token_key_str in session.keys():
        user = Users.GetBy.login_token(db, session.get(login_token_key_str))
        if user.isLoaded():
            return {"mentees": Utils.to_api_return_data(Users.Mentees.GetBy.user(db, user))}
    return []
