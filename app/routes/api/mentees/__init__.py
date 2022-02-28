from flask import Blueprint, request, session
from app import db, User
from app.auth import auth_required
from app.utils import to_api_return_data


blueprint = Blueprint("api_mentees", __name__, url_prefix="/mentee")


@blueprint.route("/register", methods=["POST"])
def register():
    return {}


@blueprint.route("/", methods=["GET"])
@auth_required
def get(user: User):
    raise NotImplemented


    # if (user := Users.GetBy.session(db, login_token_key_str, session)).isLoaded():
    #     return {"mentees": Utils.to_api_return_data(Users.Mentees.GetBy.user(db, user))}
    # return {"mentees": []}
