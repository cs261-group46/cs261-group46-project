from flask import Blueprint, request, session
from app import db, login_token_key_str
from app.models import Topics


blueprint = Blueprint("api_topics", __name__, url_prefix="/topics")


@blueprint.route("/", methods=["GET"])
def get():
    if request.args.get("startwith") is None:
        topics = Topics.GetBy.all(db)
    else:
        topics = Topics.GetBy.startswith(db, request.args.get("startwith"))
    return {"result": [{"id":topic.id, "label": topic.name} for topic in topics]}