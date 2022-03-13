from flask import Blueprint
from api.models import Department
from api.models.schemas import DepartmentSchema

departments = Blueprint("api_departments", __name__, url_prefix="/departments")


@departments.route("/", methods=["GET"])
def index():
    try:
        departments_arr = Department.query.all()
        schema = DepartmentSchema(exclude=["users"], many=True)
        result = schema.dump(departments_arr)
        return {"success": True, "data": {"departments": result}}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400
