from flask import Blueprint, request
from api.app import db
from api.models import Mentee, Mentor, Notification
from api.middleware.auth import auth_required
from api.models.MentorshipRequest import MentorshipRequest
from api.utils.cerberus_helpers import get_errors
from api.validators.MentorshipRequestsValidators import storeValidator, updateValidator


mentorshiprequests = Blueprint("api_mentorshiprequests", __name__, url_prefix="/mentorshiprequests")

@mentorshiprequests.route("/", methods=["POST"])
@auth_required
def store(user=None):
    try:
        data = dict(request.get_json())
        storeValidator.validate(data)
        if storeValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(storeValidator)
                   }, 400

        mentor = Mentor.query.filter_by(id=data.get("mentor")).first()
        mentee = Mentee.query.filter_by(id=data.get("mentee")).first()

        if mentor is None:
            return {"success": False, "errors": ["We couldn't find the requested mentor"]}, 400

        if mentee is None:
            return {"success": False, "errors": ["It appears your are not a mentee."]}, 400

        if (not user.mentee) or mentee.user.id != user.id:
            return {"success": False, "errors": ["You don't have the permission to create mentorship requests for others."]}, 401

        if mentor.user.id == mentee.user.id:
            return {"success": False, "errors": ["You cannot request yourself as a mentor"]}, 400

        is_duplicate = not MentorshipRequest.query.filter_by(mentor_id=mentor.id, mentee_id=mentee.id).first() is None
        if is_duplicate:
            return {"success": False, "errors": ["A mentorship request already sent!"]}, 400

        MentorshipRequest(mentor_id=mentor.id, mentee_id=mentee.id).commit()

        message = f'You received a new mentorship request by {user.first_name} {user.last_name}!'
        Notification(
            notification_level="alert",
            notification_type="mentoring",
            user_id=mentor.user_id,
            description=message).commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@mentorshiprequests.route("/<mentorshiprequestId>", methods=["PUT"])
@auth_required
def update(mentorshiprequestId=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400

        is_accepted = data.get("accepted")

        mentorship_request = MentorshipRequest.query.filter_by(id=mentorshiprequestId).first()

        if mentorship_request is None:
            return {"success": False, "errors": ["We couldn't find the requested mentorship request."]}, 400

        if mentorship_request.mentor.user_id != user.id:
            return {"success": False, "errors": ["You don't have permission to accept this mentorship request."]}, 401

        mentee = Mentee.query.filter_by(id=mentorship_request.mentee_id).first()

        if mentee is None:
            return {"success": False, "errors": ["Mentee doesn't exist"]}, 401

        if not is_accepted:
            message = f'Your mentorship request for {mentorship_request.mentor.user.first_name} {mentorship_request.mentor.user.last_name} was declined.'
            Notification(notification_level="alert", notification_type="learning", user_id=mentee.user.id, description=message)
            db.session.delete(mentorship_request)
            db.session.commit()
            return {"success": True, "infos": ["You have successfully declined the mentorship request"]}, 200

        message = f'Your mentorship request for {mentorship_request.mentor.user.first_name} {mentorship_request.mentor.user.last_name} was accepted!'
        Notification(notification_level="alert", notification_type="learning", user_id=mentee.user.id,
                     description=message)

        mentee.mentor_id = mentorship_request.mentor_id
        mentee.commit()
        for request_sent in mentee.mentorship_requests_sent:
            db.session.delete(request_sent)
        db.session.commit()

        return {"success": True, "infos": ["You have successfully accepted the mentorship request"]}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400
