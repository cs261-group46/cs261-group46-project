from flask import Blueprint, request, session, url_for, render_template
from app import db, User, Department, auth_required, MeetingFeedback
from app.utils.request import parse_args_list

meeting_feedback = Blueprint("api_feedback_meeting", __name__, url_prefix="/meeting_feedback")


@meeting_feedback.route("", methods=["PUT", "POST"])
@auth_required
def index(user: User):
    # data = parse_args_list("fields")
    data = request.get_json()

    if (feedback_feedback := data.get("feedback")) is not None and (feedback_meeting_id := data.get("meeting_id")) is not None:
        MeetingFeedback(
            user_id=user.id,
            meeting_id=feedback_meeting_id,
            feedback=feedback_feedback
        ).commit()
        return {"successful": True}, 200
    else:
        return {"successful": False, "errors": "Missing feedback"}, 400
