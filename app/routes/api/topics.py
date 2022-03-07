from flask import Blueprint, request
from app.models import Topic
from sqlalchemy import func
from app.middleware.auth import auth_required
from app.models.schemas import TopicSchema
from app.utils.request import parse_args_list

topics = Blueprint("api_topics", __name__, url_prefix="/topics")


@topics.route("/", methods=["GET"])
@auth_required
def index(user=None):
    try:
        if not request.args.get('startswith') is None:
            if request.args.get('startswith') == "":
                return {"success": True, "data": {"topics": []}}, 200

            start_with = request.args.get('startswith').lower()
            return_topics = Topic.query.filter(func.lower(
                Topic.name).startswith(start_with)).limit(5).all()
        else:
            return_topics = Topic.query.all()

        fields = parse_args_list("fields")
        if fields is None or (len(fields) == 1 and fields[0] == ''):
            fields = None

        schema = TopicSchema(only=fields, many=True, exclude=["meetings", "mentors", "mentees", "experts"])
        result = schema.dump(return_topics)

        return {"success": True, "data": {"topics": result}}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400
#
# @auth_required
# @topics.route("", methods=["POST"])
# def store(user):
#     data = dict(request.get_json())
#     print(user)
#     # TODO : VALIDATOR
#
#
#     departments_arr = Department.query.all()
#     return {"result": [{"id": department.id, "label": department.name} for department in departments_arr]}

# @topics.route("", methods=["POST"])
# def store():
