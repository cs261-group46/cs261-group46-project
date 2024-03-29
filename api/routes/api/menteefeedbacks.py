import datetime

from flask import Blueprint, request
from api.app import db
from api.models import MenteeFeedback
from api.middleware.auth import auth_required
from api.utils.cerberus_helpers import get_errors
from api.validators.MenteeFeedbacksValidators import updateValidator

menteefeedbacks = Blueprint("api_menteefeedbacks", __name__, url_prefix="/menteefeedbacks")


@menteefeedbacks.route("/<menteefeedbackId>", methods=["PUT"])
@auth_required
def update(menteefeedbackId=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400

        mentee_feedback = MenteeFeedback.query.filter_by(id=menteefeedbackId, mentee_id=data.get("mentee_id")).first()

        if mentee_feedback is None:
            return {"success": False, "errors": ["An unexpected error occurred."]}, 400

        if mentee_feedback.mentor_id != user.mentor.id:
            return {"success": False, "errors": ["You do not have a permission to give feedback on behalf of other users."]}, 401

        mentee_feedback.feedback = data.get("feedback")
        mentee_feedback.score = data.get("score")
        mentee_feedback.commit()

        mentee = mentee_feedback.mentee
        no_of_feedbacks = len(mentee.received_feedback)
        s = mentee.score
        mentee.score = ((s * no_of_feedbacks) + mentee_feedback.score) / (no_of_feedbacks + 1)
        db.session.add(mentee)
        db.session.commit()

        return {"success": True}, 200

    except:
        return {"success": False, "errors": ["An unexpected error occurred."]}, 400

