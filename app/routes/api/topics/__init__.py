from flask import Blueprint, request, session
from app import db, Topic


blueprint = Blueprint("api_topics", __name__, url_prefix="/topics")


@blueprint.route("/", methods=["GET"])
def get():
    if (startswith := request.args.get("startwith")) is None:
        startswith = ""
    topics = Topic.query.filter(Topic.name.ilike(f"{startswith}%")).all()
    return {"result": [{"id": topic.id, "label": topic.name} for topic in topics]}
