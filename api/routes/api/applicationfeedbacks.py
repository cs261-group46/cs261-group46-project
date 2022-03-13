import datetime

from flask import Blueprint, request
from api.models import User, ApplicationFeedback
from api.utils.cerberus_helpers import get_errors
from api.middleware.auth import auth_required
from api.validators.ApplicationFeedbacksValidators import storeValidator

applicationfeedbacks = Blueprint("api_applicationfeedbacks", __name__, url_prefix="/applicationfeedbacks")

@applicationfeedbacks.route("/", methods=["POST"])
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


        u = User.query.filter_by(id=data.get("user_id")).first()

        if u is None:
            return {"success": False,
                    "errors": ["An unexpected error occurred."]}, 400

        if u.id != user.id:
            return {"success": False, "errors": ["You do not have the permission to submit feedback on behalf other users."]}, 401

        ApplicationFeedback(user_id=u.id, feedback=data.get("feedback")).commit()
        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred."]}, 400


@applicationfeedbacks.route("/", methods=["GET"])
@auth_required(required_permission_level=1)
def get(user=None):
    feedback_arr = ApplicationFeedback.query.all()
    schema = ApplicationFeedback(exclude=["id"], many=True)
    result = schema.dump(feedback_arr)
    return {"success": True, "data": result}, 200
