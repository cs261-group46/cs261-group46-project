from app import app, db

from app.models.Department import Department
from app.models.Topic import Topic
from app.models.Room import Room
from app.models.User import User
from app.models.ExpertTopic import ExpertTopic
from app.models.Mentor import Mentor
from app.models.Mentee import Mentee
from app.models.MentorMenteeRelation import MentorMenteeRelation
from app.models.Notification import Notification
from app.models.Token import TokenType, Token, LOGIN, PASSWORD_RESET, EMAIL_VERIFY
from app.models.Meeting import MeetingType, Meeting
from app.models.Feedback import ApplicationFeedback, PairingFeedback, MeetingFeedback

with app.app_context():
    db.create_all()
