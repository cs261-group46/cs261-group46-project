from flask import Blueprint, request
from app import db, Expert, Topic
from app.middleware.auth import auth_required
from sqlalchemy import func

experts = Blueprint("api_experts", __name__, url_prefix="/experts")


@experts.route("", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()
    Expert(user_id=user.id, topics=selectedTopics).commit()
    return {"successful": True}, 200


@experts.route("/verify", methods=["GET"])
@auth_required()
def verify(user=None):
    isExpert = not Expert.query.filter_by(user_id=user.id).first() is None
    return {"isExpert": isExpert}

