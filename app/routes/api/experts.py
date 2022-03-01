from flask import Blueprint, request
from app import db, Expert, Topic
from app.middleware.auth import auth_required
from sqlalchemy import func

experts = Blueprint("api_experts", __name__, url_prefix="/experts")


@experts.route("/-1", methods=["GET"])
@auth_required()
def get(user=None):
    fields = request.args.get('fields').split(',')
    # TODO: VALIDATE
    mentor = user.expert
    return {"success": True, "data": {"expert": mentor.to_dict(show=fields)}}, 200


@experts.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()
    Expert(user_id=user.id, topics=selectedTopics).commit()
    return {"success": True}, 200


@experts.route("/-1", methods=["PUT"])
@auth_required()
def update(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    expert = user.expert

    if expert is None:
        return {"success": False, "errors": ["User not signed up as expert"]}, 401

    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()

    expert.topics = selectedTopics
    expert.commit()

    return {"success": True}, 200



@experts.route("/verify", methods=["GET"])
@auth_required()
def verify(user=None):
    isExpert = not Expert.query.filter_by(user_id=user.id).first() is None
    return {"isExpert": isExpert}

