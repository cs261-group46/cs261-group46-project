from flask import Blueprint, request
from sqlalchemy import func

from app import User, db
from app.middleware.auth import auth_required
from app.models.schemas import UserSchema
from app.utils.marshmallow_helpers import get_results
from app.utils.request import parse_args_list

users = Blueprint("api_users", __name__, url_prefix="/users")


@users.route("/", methods=["GET"])
@auth_required
def index(user=None):
    try:
        if not request.args.get('startswith') is None:
            if request.args.get('startswith') == "":
                return {"success": True, "data": {"users": []}}, 200

            start_with = request.args.get('startswith').lower()
            return_users = User.query.filter(func.lower(
                User.email).startswith(start_with)).limit(5).all()
        else:
            return_users = User.query.all()

        fields = parse_args_list("fields")
        if fields is None or (len(fields) == 1 and fields[0] == ''):
            fields = None

        schema = UserSchema(only=fields, many=True,
                            exclude=["meeting_feedback", "mentee", "permissions", "notifications", "mentor", "expert",
                                     "meetings_attending", "meetings_hosted", "meetings_invited"])
        result = schema.dump(return_users)

        return {"success": True, "data": {"users": result}}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@users.route("/<userId>", methods=["GET"])
@auth_required
def get(userId=None, user=None):
    try:
        return_user = User.query.filter_by(id=userId).first()
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

    if return_user is None:
        return {"success": False, "errors": ["The user doesn't exist"]}, 400

    if user.id != return_user.id:
        return {"success": False, "errors": ["You don't have the permissions to access the requested data"]}, 401

    try:
        result = get_results(UserSchema, return_user)
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

    return {"success": True, "data": {"user": result}}, 200


@users.route("/loggedin/", methods=["GET"])
@auth_required
def get_logged_in(user=None):
    if user is None:
        return {"success": False, "data": {"user": None}}, 400
    return {"success": True, "data": {"user": user.id}}, 200


@users.route("/<userId>")
@auth_required
def destroy(userId=None, user=None):

    try:
        return_user = User.query.filter_by(id=userId).first()
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

    if return_user is None:
        return {"success": False, "errors": ["The user doesn't exist"]}, 400

    if user.id != return_user.id:
        return {"success": False, "errors": ["You don't have the permissions to delete the user."]}, 401

    db.session.delete(user)
    db.session.commit()
    return {"success": True}
