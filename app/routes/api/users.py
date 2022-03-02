from flask import Blueprint, request, session
from app import db, User, Topic
from app.middleware.auth import auth_required
from app.models.schemas import UserSchema
from app.utils.request import parse_args_list

users = Blueprint("api_users", __name__, url_prefix="/users")

@users.route("/<userId>", methods=["GET"])
@auth_required()
def get(userId=None, user=None):
    fields = parse_args_list("fields")
    print(fields)
    returnUser = User.query.filter_by(id=userId).first()

    if returnUser is None:
        return {"success": False, "errors": ["The user doesn't exist"]}, 400

    schema = UserSchema(only=fields)
    result = schema.dump(returnUser)

    return {"success": True, "data": {"user": result}}, 200


@users.route("/loggedin/", methods=["GET"])
@auth_required()
def get_logged_in(user=None):
    if user is None:
        return {"success": False, "errors": ["No user is logged in"]}, 400
    return {"success": True, "data": {"user": user.id}}, 200

@users.route("/<userId>", methods=["PUT"])
@auth_required()
def update(user=None):
    print("interest received")
    data = dict(request.get_json())
    # TODO: VALIDATE

    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("interests"))).all()

    user.topics = selectedTopics
    user.commit()

    return {"successful": True}, 200
