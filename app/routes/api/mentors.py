from flask import Blueprint


mentors = Blueprint("api_mentors", __name__, url_prefix="/mentor")


@mentors.route("/register", methods=["POST"])
def register():
    return {}

