from flask import Blueprint
from app import Mentee
from app.middleware.auth import auth_required

mentees = Blueprint("api_mentees", __name__, url_prefix="/mentees")


@mentees.route("/<menteeId>", methods=["GET"])
@auth_required()
def get(menteeId=None, user=None):
     # TODO : VALIDATE
    mentee = Mentee.query.filter_by(id=menteeId).first()

    return {"success": True, "data": {"mentee": mentee.to_dict()}}, 200



# @mentees.route("", methods=["GET"])
# @token_required
# def get():
#     return {"mentees": }
