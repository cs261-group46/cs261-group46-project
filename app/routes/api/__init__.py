from flask import Blueprint, request, session

blueprint = Blueprint("api", __name__, url_prefix="/api")

from app.routes.api.users       import blueprint as api_users_module
from app.routes.api.mentors     import blueprint as api_mentors_module
from app.routes.api.mentees     import blueprint as api_mentees_module
from app.routes.api.departments import blueprint as api_department_module
from app.routes.api.topics      import blueprint as api_topics_module


blueprint.register_blueprint(api_users_module)
blueprint.register_blueprint(api_mentors_module)
blueprint.register_blueprint(api_mentees_module)
blueprint.register_blueprint(api_department_module)
blueprint.register_blueprint(api_topics_module)