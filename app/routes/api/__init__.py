from flask import Blueprint

api = Blueprint("api", __name__, url_prefix="/api")

from app.routes.api.auth import auth
from app.routes.api.departments import departments
from app.routes.api.topics import topics
from app.routes.api.experts import experts
# from app.api.mentees import mentees
# from app.api.mentors import mentors
# from app.api.users import users


api.register_blueprint(auth)
api.register_blueprint(departments)
api.register_blueprint(topics)
api.register_blueprint(experts)

# api.register_blueprint(mentees)
# api.register_blueprint(mentors)
# api.register_blueprint(users)
