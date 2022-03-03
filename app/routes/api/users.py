from flask import Blueprint, request, session
from app import db, User, Topic, UserTopic
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
def update(userId=None, user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE

    returnedUser = User.query.filter_by(id=userId).first()

    if returnedUser is None:
        return {"success": False, "errors": ["Requested user not found."]}, 400

    if returnedUser.id != user.id:
        return {"success": False, "errors": ["You don't have the permissions to update a user"]}, 401

    selectedTopics = Topic.query.filter(Topic.id.in_([interest.get("interest") for interest in data.get("interests")])).all()
    selectedTopicsOrdered = [next(s for s in selectedTopics if s.id == interest.get("interest")) for interest in sorted(data.get("interests"), key=(lambda i: i.get("priority")))]

    UserTopic.query.filter_by(user_id=userId).delete()
    db.session.commit()

    count = 1
    for topic in selectedTopicsOrdered:
        user_topic = UserTopic(priority=count)
        user_topic.topic = topic
        user_topic.user = user
        db.session.add(user_topic)
        count += 1

    db.session.commit()

    return {"success": True}, 200
