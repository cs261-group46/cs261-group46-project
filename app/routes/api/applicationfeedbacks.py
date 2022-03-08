from flask import Blueprint, request
from app import ApplicationFeedback
from app.middleware.auth import auth_required

application_feedback = Blueprint("api_feedback_application", __name__, url_prefix="/application_feedback")


@application_feedback.route("/", methods=["GET"])
@auth_required
def index(user=None):
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
