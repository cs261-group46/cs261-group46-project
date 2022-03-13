from api.routes.api.mentors import mentors
from api.routes.api.mentees import mentees
from api.routes.api.experts import experts
from api.routes.api.notifications import notifications
from api.routes.api.topics import topics
from api.routes.api.departments import departments
from api.routes.api.auth import auth
from api.routes.api.users import users
from api.routes.api.mentorshiprequests import mentorshiprequests
from api.routes.api.meetings import meetings
from api.routes.api.rooms import rooms
from api.routes.api.applicationfeedbacks import applicationfeedbacks
from api.routes.api.menteefeedbacks import menteefeedbacks
from api.routes.api.mentorfeedbacks import mentorfeedbacks
from api.routes.api.meetingfeedbacks import meetingfeedbacks

from flask import Blueprint

api = Blueprint("api", __name__, url_prefix="/api")

api.register_blueprint(auth)
api.register_blueprint(departments)
api.register_blueprint(topics)
api.register_blueprint(experts)
api.register_blueprint(mentors)
api.register_blueprint(users)
api.register_blueprint(notifications)
api.register_blueprint(mentees)
api.register_blueprint(mentorshiprequests)
api.register_blueprint(meetings)
api.register_blueprint(rooms)
api.register_blueprint(applicationfeedbacks)
api.register_blueprint(menteefeedbacks)
api.register_blueprint(mentorfeedbacks)
api.register_blueprint(meetingfeedbacks)