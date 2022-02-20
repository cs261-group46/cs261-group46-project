from flask import Blueprint

api = Blueprint("api", __name__, url_prefix="/api")

from app.api.auth import auth
from app.api.departments import departments
# from app.api.mentees import mentees
# from app.api.mentors import mentors
# from app.api.users import users


api.register_blueprint(auth)
api.register_blueprint(departments)
# api.register_blueprint(mentees)
# api.register_blueprint(mentors)
# api.register_blueprint(users)
