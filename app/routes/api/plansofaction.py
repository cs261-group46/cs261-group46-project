from flask import Blueprint, request
from app import Mentee
from app.middleware.auth import auth_required
from app.models.schemas import DepartmentSchema, MenteeSchema
from app.utils.dict import respect_more_delimiters
from app.utils.request import parse_args_list

plansofaction = Blueprint("api_plansofaction", __name__, url_prefix="/plansofaction")


@plansofaction.route("/<menteeId>", methods=["GET"])
@auth_required()
def get(menteeId=None, user=None):
    fields = parse_args_list("fields")
    if len(fields) == 1 and fields[0] == '':
        fields = None
    returnMentee = Mentee.query.filter_by(id=menteeId).first()

    if returnMentee is None:
        return {"success": False, "errors": ["The requested mentee doesn't exist"]}, 400

    if (returnMentee.user.id != user.id) and (returnMentee.mentor.id != user.mentor.id):
        return {"success": False, "errors": ["You don't have the permission to access this data"]}, 401


    fieldsCut = None
    if not fields is None:
        fieldsCut = [".".join(field.split(".")[:2]) for field in fields]

    schema = MenteeSchema(only=fieldsCut)
    result = respect_more_delimiters(schema.dump(returnMentee), fields)
    return {"success": True, "data": {"mentee": result}}, 200
