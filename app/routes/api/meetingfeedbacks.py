import datetime

from flask import Blueprint, request

from app import User, MeetingFeedback, Meeting
from app.middleware.auth import auth_required
from app.utils.cerberus_helpers import get_errors
from app.validators.MeetingFeedbacksValidators import storeValidator

meetingfeedbacks = Blueprint("api_meetingfeedbacks", __name__, url_prefix="/meetingfeedbacks")


@meetingfeedbacks.route("/", methods=["POST"])
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

        meeting = Meeting.query.filter_by(id=data.get("meeting_id")).first()

        if meeting is None:
            return {"success" : False, "errors": ["Could not find the requested meeting"]}, 400

        if meeting.date > datetime.datetime.now():
            return {"success" : False, "errors": ["The meeting did not take place yet."]}, 400

        u = User.query.filter_by(id=data.get("user_id")).first()

        if u.id != user.id:
                return {"success": False, "errors": ["You do not have the permission to submit feedback on behalf other users."]}, 401

        if not (meeting in u.meetings_attending or (meeting in u.meetings_hosted and meeting.meeting_type == "one on one meeting")):
            return {"success": False,
                    "errors": ["You do not have the permission to submit feedback for a meeting in which you did not participate"]}, 401

        MeetingFeedback(meeting=meeting, user_id=u.id, feedback=data.get("feedback")).commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred."]}, 400
