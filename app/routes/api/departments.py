from flask import Blueprint, request
from app import Department

departments = Blueprint("api_departments", __name__, url_prefix="/departments")


@departments.route("/", methods=["GET"])
def index():
    # TODO : CAN INCLUDE FILTERS + CHANGE IT TO TO_DICT IF REQUIRED
    departments_arr = Department.query.all()
    return {"success": True, "data": {"departments": [{"id": department.id, "label": department.name} for department in departments_arr]}}, 200
