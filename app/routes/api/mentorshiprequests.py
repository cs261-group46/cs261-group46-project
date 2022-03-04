from flask import Blueprint, request
from sqlalchemy import func, any_
from app import db, Mentee

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
    mentee = Mentee.query.filter_by(id=mentorship_request.get("mentee")).first()

    if mentor is None:
        return {"success": False, "errors": ["We couldn't find the requested mentor"]}, 400

    if mentee is None:
        return {"success": False, "errors": ["It appears your are not a mentee."]}, 400

    isDuplicate = not MentorshipRequest.query.filter_by(mentor_id=mentor.id, mentee_id=mentee.id).first() is None
    if isDuplicate is None:
        return {"success": False, "errors": ["A mentorship request already sent!"]}, 400


    if mentorship_request.get("mentee") != mentee.id or mentee.user_id != user.id:
        return {"success": False, "errors": ["You don't have permission to create new mentorship requests for the given user"]}, 401

    MentorshipRequest(mentor_id=mentor.id, mentee_id=mentorship_request.get("mentee")).commit()

    Notification(
        notification_level="alert",
        notification_type="mentoring",
        user_id=mentor.user_id,
        description="You received a new mentorship request!").commit()

    return {"success": True}, 200

@mentorshiprequests.route("/<mentorshiprequestId>", methods=["PUT"])
@auth_required()
def update(mentorshiprequestId=None, user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE

    mentorship_request = MentorshipRequest.query.filter_by(id=mentorshiprequestId).first()

    isAccepted = data.get("accepted")

    if mentorship_request is None:
        return {"success": False, "errors": ["We couldn't find the requested mentorship request"]}, 400

    if mentorship_request.mentor.user_id != user.id:
        return {"success": False, "errors": ["You don't have permission to accept this mentorship request."]}, 401


    mentee = Mentee.query.filter_by(id=mentorship_request.mentee_id).first()

    if mentee is None:
        return {"success": False, "errors": ["Mentee doesn't exist"]}, 401

    if not isAccepted:
        db.session.delete(mentorship_request)
        db.session.commit()
        return {"success": True, "infos": ["You have successfully declined the mentorship request"]}, 200


    mentee.mentor_id = mentorship_request.mentor_id
    mentee.commit()

    db.session.delete(mentorship_request)
    db.session.commit()

    return {"success": True, "infos": ["You have successfully accepted the mentorship request"]}, 200

    # mentor = Mentor.query.filter_by(id=mentorship_request.get("mentor")).first()
    #
    # if mentor is None:
    #     return {"success": False, "errors": ["We couldn't find the requested mentor"]}, 400
    #
    # if mentorship_request.get("user") != user.id:
    #     return {"success": False, "errors": ["You don't have permission to create new mentorship requests for the given user"]}, 401
    #
    # MentorshipRequest(mentor_id=mentor.id, user_id=mentorship_request.get("user")).commit()
    #
    # Notification(
    #     notification_level="alert",
    #     notification_type="mentoring",
    #     user_id=mentor.user_id,
    #     description="You received a new mentorship request!").commit()
    #
