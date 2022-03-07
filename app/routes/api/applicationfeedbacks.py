from flask import Blueprint, request, session, url_for, render_template
from app import db, User, Department, auth_required, ApplicationFeedback

application_feedback = Blueprint("api_feedback_application", __name__, url_prefix="/application_feedback")


@application_feedback.route("", methods=["PUT", "POST"])
@auth_required
def index(user: User):
    # data = parse_args_list("fields")
    data = request.get_json()

    if (feedback_feedback := data.get("feedback")) is not None:
        ApplicationFeedback(
            user_id=user.id,
            feedback=feedback_feedback
        ).commit()
        return {"successful": True}, 200
    else:
        return {"successful": False, "errors": "Missing feedback"}, 400
