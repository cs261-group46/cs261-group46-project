from app.routes.api.mentors import mentors
from app.routes.api.mentees import mentees
from app.routes.api.experts import experts
from app.routes.api.notifications import notifications
from app.routes.api.topics import topics
from app.routes.api.departments import departments
from app.routes.api.auth import auth
from app.routes.api.users import users
from app.routes.api.mentorshiprequests import mentorshiprequests
from app.routes.api.meetings import meetings
from app.routes.api.rooms import rooms
from app.routes.api.applicationfeedbacks import application_feedback
from app.routes.api.menteefeedbacks import menteefeedbacks
from app.routes.api.mentorfeedbacks import mentorfeedbacks
from app.routes.api.meetingfeedbacks import meetingfeedbacks

# from app.routes.api.meetingfeedbacks import meeting_feedback

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
api.register_blueprint(application_feedback)
api.register_blueprint(menteefeedbacks)
api.register_blueprint(mentorfeedbacks)
api.register_blueprint(meetingfeedbacks)

# api.register_blueprint(meeting_feedback)
