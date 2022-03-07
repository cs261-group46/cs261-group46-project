from flask import Blueprint
from app import Department
from app.models.schemas import DepartmentSchema

departments = Blueprint("api_departments", __name__, url_prefix="/departments")


@departments.route("/", methods=["GET"])
def index():
    departments_arr = Department.query.all()
    schema = DepartmentSchema(exclude=["users"], many=True)
    result = schema.dump(departments_arr)
    return {"success": True, "data": {"departments": result}}, 200
