from flask import Blueprint, request, session
from app import db
from app.models import Topic


topics = Blueprint("api_topics", __name__, url_prefix="/topics")


@topics.route("", methods=["GET"])
def get():
    data = dict(request.get_json())
    start_with = f'%{data.get("query")}'
    topics = Topic.query.filter(Topic.name.like(start_with)).all()

    return {"result": [{"id": topic.id, "label": topic.name} for topic in topics]}
