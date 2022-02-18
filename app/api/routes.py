from flask import Blueprint, request, session
from app import db, login_token_key_str, Users, Subjects, Departments


blueprint = Blueprint("api", __name__, url_prefix="/api")


@blueprint.route("/departments", methods=["GET"])
def get_departments():
    return Departments.get_all(db)


@blueprint.route("/subjects", methods=["GET"])
def get_subjects():
    return Subjects.get_all(db)


from app.api.users.routes import blueprint as api_users_module
from app.api.mentors.routes import blueprint as api_mentors_module
from app.api.mentees.routes import blueprint as api_mentees_module

blueprint.register_blueprint(api_users_module)
blueprint.register_blueprint(api_mentors_module)
blueprint.register_blueprint(api_mentees_module)
