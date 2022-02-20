from flask import Blueprint, request, session
from app import db, Mentee  # , Users
from app.middleware.auth import token_required
# import app.user as Users
# import app.user.mentor as Mentors
# import app.user.mentee as Mentees
import app.utils as Utils


mentees = Blueprint("api_mentees", __name__, url_prefix="/mentees")


@mentees.route("/register", methods=["POST"])
def register():
    return {}


# @mentees.route("", methods=["GET"])
# @token_required
# def get():
#     return {"mentees": }
