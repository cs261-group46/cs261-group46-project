from flask import Blueprint, request, session
from app import db, login_token_key_str
from app.models import Departments


blueprint = Blueprint("api_departments", __name__, url_prefix="/departments")


@blueprint.route("/", methods=["GET"])
def get():
    print(db)
    departments = Departments.GetBy.all(db)
    print(departments)
    return {"result": [{"id": department.id, "label": department.name} for department in departments]}
