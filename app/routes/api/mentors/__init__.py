from flask import Blueprint, request, session
from app import db, User
from app.auth import auth_required
from app.utils import to_api_return_data


blueprint = Blueprint("api_mentors", __name__, url_prefix="/mentor")


@blueprint.route("/register", methods=["POST"])
@auth_required
def register(user: User):

    data = request.get_json()
    about = data.get("about")
    topics = data.get("topics")

    if not about:
        return {"successful": False, "errors": ["About.Missing"]}
    if not topics:
        return {"successful": False, "errors": ["Topics.Missing"]}
    # Start by creating a mentor profile
    # Then, add the topics
    return {}


@blueprint.route("/", methods=["GET"])
@auth_required
def get(user: User):
    raise NotImplemented


#TODO
@blueprint.route("/your-mentees", methods=["GET"])
@auth_required
def mentees(user : User):
    return None
 