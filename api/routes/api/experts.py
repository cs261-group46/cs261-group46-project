from flask import Blueprint, request
from api.models import Expert, Topic, Notification
from api.middleware.auth import auth_required
from api.utils.cerberus_helpers import get_errors
from api.validators.ExpertsValidators import storeValidator, updateValidator

experts = Blueprint("api_experts", __name__, url_prefix="/experts")


# @experts.route("/<expertId>", methods=["GET"])
# @auth_required
# def get(expertId=None, user=None):
#     fields = parse_args_list("fields")
#     # TODO: VALIDATE
#     expert = Expert.query.filter_by(id=expertId).first()
#
#     if expert is None:
#         return {"success": False, "errors": ["The expert with the given id doesn't exist"]}, 400
#
#     schema = ExpertSchema(only=fields)
#     result = schema.dump(expert)
#
#     return {"success": True, "data": {"expert": result}}, 200


@experts.route("/", methods=["POST"])
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

        is_duplicate = not Expert.query.filter_by(user_id=user.id).first() is None
        if is_duplicate:
            return {"success": False, "errors": ["User's expert account already exists."]}

        if data.get("user_id") != user.id:
            return {"success": False, "errors": ["You are not allowed to create expert accounts on other's behalf."]}


        selected_topics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()
        Expert(user_id=user.id, topics=selected_topics).commit()
        Notification(notification_level="info", notification_type="expertise", user_id=data.get("user_id"),
                     description="You've become an expert. You can now schedule public and private group meetings for other users, sharing your skills and expertise with others on their skillQuest.").commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@experts.route("/<expertId>", methods=["PUT"])
@auth_required
def update(expertId=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                "success": False,
                "errors": get_errors(updateValidator)
            }, 400

        expert = Expert.query.filter_by(id=expertId).first()

        if expert is None:
            return {"success": False, "errors": ["The expert that is trying to be changed doesn't exist"]}, 400

        if expert.user.id != user.id and user.permissions < 1:
            return {"success": False, "errors": ["You don't have the permissions to update an expert account on other's behalf."]}, 401

        selected_topics = Topic.query.filter(Topic.id.in_(data.get("expertises"))).all()
        expert.topics = selected_topics
        expert.commit()

        Notification(notification_level="info", notification_type="expertise", user=expert.user,
                     description="Your expert account details have changed.").commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400
