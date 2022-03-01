from flask import Blueprint


mentees = Blueprint("api_mentees", __name__, url_prefix="/mentees")


@mentees.route("/register", methods=["POST"])
def register():
    return {}


# @mentees.route("", methods=["GET"])
# @token_required
# def get():
#     return {"mentees": }
