from flask import Blueprint, request
from app import db, Expert, Topic
from app.middleware.auth import auth_required
from sqlalchemy import func

from app.models.schemas import ExpertSchema
from app.utils.request import parse_args_list

experts = Blueprint("api_experts", __name__, url_prefix="/experts")


@experts.route("/<expertId>", methods=["GET"])
@auth_required()
def get(expertId=None, user=None):
    fields = parse_args_list("fields")
    # TODO: VALIDATE
    expert = Expert.query.filter_by(id=expertId).first()

    if expert is None:
        return {"success": False, "errors": ["The expert with the given id doesn't exist"]}, 400

    schema = ExpertSchema(only=fields)
    result = schema.dump(expert)

    return {"success": True, "data": {"expert": result}}, 200


@experts.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()
    Expert(user_id=user.id, topics=selectedTopics).commit()
    return {"success": True}, 200


@experts.route("/<expertId>", methods=["PUT"])
@auth_required()
def update(expertId=None, user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE

    expert = Expert.query.filter_by(id=expertId).first()

    if expert is None:
        return {"success": False, "errors": ["The expert that is trying to be changed doesn't exist"]}, 400

    if expert.user_id != user.id and user.permissions < 1:
        return {"success": False, "errors": ["You do not have the permissions to change the data of other experts"]}, 401

    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()
    expert.topics = selectedTopics
    expert.commit()

    return {"success": True}, 200



# @experts.route("/verify", methods=["GET"])
# @auth_required()
# def verify(user=None):
#     isExpert = not Expert.query.filter_by(user_id=user.id).first() is None
#     return {"isExpert": isExpert}

