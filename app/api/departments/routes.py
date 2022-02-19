from flask import Blueprint, request, session, jsonify, make_response
from app import db, login_token_key_str
from app.models import Departments


blueprint = Blueprint("api_departments", __name__, url_prefix="/departments")


@blueprint.route("", methods=["GET"])
def get():
    departments = Departments.GetBy.all(db)
    return {"result": [{"id": department.id, "label": department.name} for department in departments]}
