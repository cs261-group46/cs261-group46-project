from flask import Blueprint, request, session, jsonify, make_response
from app import Department


blueprint = Blueprint("api_departments", __name__, url_prefix="/departments")


@blueprint.route("/", methods=["GET"])
def get():
    if (startswith := request.args.get("startwith")) is None:
        startswith = ""
    departments = Department.query.filter(Department.name.ilike(f"{startswith}%")).all()
    return {"result": [{"id": department.id, "label": department.name} for department in departments]}
