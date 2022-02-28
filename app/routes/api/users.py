from flask import Blueprint, request, session
from app import db, User, Topic
from app.middleware.auth import auth_required

users = Blueprint("api_users", __name__, url_prefix="/users")

@users.route("", methods=["GET"])
@auth_required()
def get(user=None):
    fields = request.args.get('fields').split(',')
    # TODO: VALIDATE
    return {"successful": True, "data": {"user": user.to_dict(show=fields)}}, 200


@users.route("", methods=["PUT"])
@auth_required()
def update(user=None):
    print("interest received")
    data = dict(request.get_json())
    # TODO: VALIDATE

    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("interests"))).all()

    user.topics = selectedTopics
    user.commit()

    return {"successful": True}, 200
