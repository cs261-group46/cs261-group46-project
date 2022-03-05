from flask import Blueprint, request
from app import Mentee, Topic, MenteeTopic, db, Meeting
from app.middleware.auth import auth_required
from app.models.schemas import MenteeSchema
from app.utils.request import parse_args_list

meetings = Blueprint("api_meetings", __name__, url_prefix="/meetings")

# id = db.Column(db.Integer, primary_key=True)
#     host_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     title = db.Column(db.String(128), nullable=False)
#     date = db.Column(db.DateTime, nullable=False)
#     room_id = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=False)
#     link = db.Column(db.Text, nullable=True)
#     meeting_type = db.Column(db.String(18), db.CheckConstraint(
#         "meeting_type IN ('workshop', 'group session', 'one on one meeting')"))
#     duration = db.Column(db.Integer, nullable=False)
#     capacity = db.Column(db.Integer, nullable=False)

# @meetings.route("/", methods=["POST"])
# @auth_required()
# def store(user=None):
#     data = dict(request.get_json())
#     # TODO : VALIDATE
#
#     meeting = Meeting(host_id=data.get("host"), title=data.get("title"), date=data.get("title"), room_id=data.get("room").get("id"), link=data.get("link"), meeting_type=).commit()
#
#     selectedTopics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
#     selectedTopicsOrdered = [next(s for s in selectedTopics if s.id == skill.get("skill")) for skill in
#                              sorted(data.get("skills"), key=(lambda i: i.get("priority")))]
#
#     count = 1
#     for topic in selectedTopicsOrdered:
#         mentee_topic = MenteeTopic(priority=count)
#         mentee_topic.topic = topic
#         mentee_topic.mentee = mentee
#         db.session.add(mentee_topic)
#         count += 1
#     #     db.session.add(mentor_topic)
#     #
#     db.session.commit()
#
#     return {"success": True}, 200
