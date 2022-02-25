from flask import Blueprint, request, session
from app import db
from app.models import Topic
from sqlalchemy import func
from app.middleware.auth import auth_required


topics = Blueprint("api_topics", __name__, url_prefix="/topics")


@topics.route("", methods=["GET"])
@auth_required()
def get(user=None):
    start_with = request.args.get('startswith').lower()
    topics = Topic.query.filter(func.lower(Topic.name).startswith(start_with)).limit(5).all()

    return {"result": [{"id": topic.id, "label": topic.name} for topic in topics]}

#
# @auth_required
# @topics.route("", methods=["POST"])
# def store(user):
#     data = dict(request.get_json())
#     print(user)
#     # TODO : VALIDATOR
#
#
#     departments_arr = Department.query.all()
#     return {"result": [{"id": department.id, "label": department.name} for department in departments_arr]}

# @topics.route("", methods=["POST"])
# def store():