from flask import Blueprint, request, session, jsonify, make_response
from app import db, Department
from app.middleware.auth import auth_required

departments = Blueprint("api_departments", __name__, url_prefix="/departments")


@departments.route("", methods=["GET"])
@auth_required(0)
def get():
    departments_arr = Department.query.all()
    return {"result": [{"id": department.id, "label": department.name} for department in departments_arr]}
