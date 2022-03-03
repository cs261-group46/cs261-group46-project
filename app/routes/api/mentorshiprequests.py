from flask import Blueprint, request
from sqlalchemy import func, any_
from app import db


from app.middleware.auth import auth_required
from app import Topic, Mentor, Notification, MentorTopic
from app.models.MentorshipRequest import MentorshipRequest
from app.models.schemas import MentorSchema
from app.utils.mentor_reccomendations import sort_mentors
from app.utils.request import parse_args_list

mentorshiprequests = Blueprint("api_mentorshiprequests", __name__, url_prefix="/mentorshiprequests")

@mentorshiprequests.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentorship_request = data.get("mentorshiprequest")

    mentor = Mentor.query.filter_by(id=mentorship_request.get("mentor")).first()

    if mentor is None:
        return {"success": False, "errors": ["We couldn't find the requested mentor"]}, 400

    if mentorship_request.get("user") != user.id:
        return {"success": False, "errors": ["You don't have permission to create new mentorship requests for the given user"]}, 401

    MentorshipRequest(mentor_id=mentor.id, user_id=mentorship_request.get("user")).commit()

    Notification(
        notification_level="alert",
        notification_type="mentoring",
        user_id=mentor.user_id,
        description="You received a new mentorship request!").commit()

    return {"success": True}, 200