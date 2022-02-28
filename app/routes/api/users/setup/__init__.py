from flask import Blueprint, request, session

blueprint = Blueprint("api_users_setup", __name__, url_prefix="/setup")


@blueprint.route("/expert")
def expert():
    return "NotImplemented"