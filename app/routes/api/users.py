from flask import Blueprint, request, session
from sqlalchemy import func

from app import db, User, Topic
from app.middleware.auth import auth_required
from app.models.schemas import UserSchema
from app.utils.dict import respect_more_delimiters
from app.utils.request import parse_args_list

users = Blueprint("api_users", __name__, url_prefix="/users")

@users.route("/", methods=["GET"])
@auth_required()
def index(user=None):
    fields = parse_args_list("fields")
    start_with = None
    # TODO : VALIDATE

    if not request.args.get('startswith') is None:
        if not request.args.get('startswith'):
            return {"success": True, "data": {"users": []}}, 200
        start_with = request.args.get('startswith').lower()
        users = User.query.filter(func.lower(
            User.email).startswith(start_with)).limit(5).all()
    else:
        users = User.query.all()

    schema = UserSchema(only=fields, many=True)
    result = schema.dump(users)
    return {"success": True, "data": {"users": result}}, 200
    # fields = parse_args_list("fields")
    # returnUser = User.query.filter_by(id=userId).first()
    #
    # if returnUser is None:
    #     return {"success": False, "errors": ["The user doesn't exist"]}, 400
    #
    # schema = UserSchema(only=fields)
    # result = schema.dump(returnUser)
    #
    # return {"success": True, "data": {"user": result}}, 200


@users.route("/<userId>", methods=["GET"])
@auth_required()
def get(userId=None, user=None):
    fields = parse_args_list("fields")
    if len(fields) == 1 and fields[0] == '':
        fields = None
    returnUser = User.query.filter_by(id=userId).first()

    if returnUser is None:
        return {"success": False, "errors": ["The user doesn't exist"]}, 400

    fieldsCut = None
    if not fields is None:
        fieldsCut = [".".join(field.split(".")[:2]) for field in fields]

    schema = UserSchema(only=fieldsCut)
    result = respect_more_delimiters(schema.dump(returnUser), fields)
    return {"success": True, "data": {"user": result}}, 200


@users.route("/loggedin/", methods=["GET"])
@auth_required()
def get_logged_in(user=None):
    if user is None:
        return {"success": False, "data": {"user": None}}, 400
    return {"success": True, "data": {"user": user.id}}, 200

