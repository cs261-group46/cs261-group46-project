from flask import Blueprint, request
from app import MentorFeedback
from app.middleware.auth import auth_required
from app.utils.cerberus_helpers import get_errors
from app.validators.MentorFeedbacksValidators import updateValidator

mentorfeedbacks = Blueprint("api_mentorfeedbacks", __name__, url_prefix="/mentorfeedbacks")

@mentorfeedbacks.route("/<mentorfeedbackId>", methods=["PUT"])
@auth_required
def update(mentorfeedbackId=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400

        mentor_feedback = MentorFeedback.query.filter_by(id=mentorfeedbackId, mentor_id=data.get("mentor_id")).first()

        if mentor_feedback is None:
            return {"success": False, "errors": ["An unexpected error occurred."]}, 400

        if mentor_feedback.mentee_id != user.mentee.id:
            return {"success": False, "errors": ["You do not have a permission to give feedback on behalf of other users."]}, 401

        mentor_feedback.feedback = data.get("feedback")
        mentor_feedback.score = data.get("score")
        mentor_feedback.commit()

        return {"success": True}, 200

    except:
        return {"success": False, "errors": ["An unexpected error occurred."]}, 400

