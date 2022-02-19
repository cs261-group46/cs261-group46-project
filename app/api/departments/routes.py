from flask import Blueprint, request, session
from app import db, login_token_key_str
from app.models import Departments


blueprint = Blueprint("api_departments", __name__, url_prefix="/departments")


@blueprint.route("/", methods=["GET"])
def get():
    if request.args.get("startwith") is None:
        departments = Departments.GetBy.all(db)
    else:
        departments = Departments.GetBy.startswith(db, request.args.get("startwith"))

    return {"result": [{"id": department.id, "label": department.name} for department in departments]}
