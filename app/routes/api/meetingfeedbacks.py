from flask import Blueprint, request, session, url_for, render_template
from app import db, User, Department, MeetingFeedback, Meeting
from app.utils.cerberus_helpers import get_errors
from app.utils.request import parse_args_list
from app.middleware.auth import auth_required
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

        if data.get("user_id") != user.id:
                return {"success": False, "errors": ["You do not have the permission to submit feedback on behalf other users."]}, 404

        MeetingFeedback(meeting=meeting, user_id=data.get("user_id"), feedback=data.get("feedback")).commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred."]}, 400
