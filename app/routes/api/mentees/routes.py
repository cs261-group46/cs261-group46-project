from flask import Blueprint, request, session
from app import db, login_token_key_str
import app.user as Users
import app.utils as Utils


blueprint = Blueprint("api_mentees", __name__, url_prefix="/mentee")


@blueprint.route("/register", methods=["POST"])
def register():
    return {}


@blueprint.route("/", methods=["GET"])
def get():
    if (user := Users.GetBy.session(db, login_token_key_str, session)).isLoaded():
        return {"mentees": Utils.to_api_return_data(Users.Mentees.GetBy.user(db, user))}
    return {"mentees": []}
