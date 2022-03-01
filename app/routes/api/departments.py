from flask import Blueprint, request
from app import Department

departments = Blueprint("api_departments", __name__, url_prefix="/departments")


@departments.route("/", methods=["GET"])
def index():
    departments_arr = Department.query.all()
    return {"data": [{"id": department.id, "label": department.name} for department in departments_arr]}, 200


