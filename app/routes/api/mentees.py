from flask import Blueprint, request
from app import Mentee
from app.middleware.auth import auth_required
from app.models.schemas import MenteeSchema
from app.utils.request import parse_args_list

mentees = Blueprint("api_mentees", __name__, url_prefix="/mentees")


@mentees.route("/<menteeId>", methods=["GET"])
@auth_required()
def get(menteeId=None, user=None):
    # TODO : VALIDATE
    fields = parse_args_list("fields")

    mentee = Mentee.query.filter_by(id=menteeId).first()

    if mentee is None:
         return {"success": False, "errors": ["Mentor does not exist"]}, 400

    schema = MenteeSchema(only=fields)
    result = schema.dump(mentee)

    return {"success": True, "data": {"mentee": result}}, 200



# @mentees.route("", methods=["GET"])
# @token_required
# def get():
#     return {"mentees": }
