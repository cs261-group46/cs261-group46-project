from flask import Blueprint, request
from sqlalchemy import func, any_

from app.middleware.auth import auth_required
from app import Topic, Mentor, Notification
from app.utils.mentor_reccomendations import sort_mentors

mentors = Blueprint("api_mentors", __name__, url_prefix="/mentors")


@mentors.route("/", methods=["GET"])
@auth_required()
def index(user=None):
    fields = []
    filters = []

    if request.args:
        fields = [] if request.args.get(
            'fields') is None else request.args.get('fields').split(',')
        filters = [] if request.args.get(
            'filters') is None else request.args.get('filters').split(',')

    # TODO: VALIDATE

    # Need to introduce some filters ?
    mentors = Mentor.query

    if "suitable" in filters:
        mentors = sort_mentors(mentors)

    mentors = mentors.all()
    return {"success": True, "data": {"mentors": [mentor.to_dict(show=fields) for mentor in mentors]}}, 200


@mentors.route("/request", methods=["POST"])
@auth_required()
def requestMentor(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentor_id = data.get("mentor")

    mentor = Mentor.query.filter_by(id=mentor_id).first()

    Notification(
        notification_level="alert",
        notification_type="mentoring",
        user_id=mentor.user_id,
        description="You received a new mentorship request").commit()

    return {"success" : True}, 200




@mentors.route("/-1", methods=["GET"])
@auth_required()
def get(user=None):
    fields = request.args.get('fields').split(',')
    # TODO: VALIDATE
    mentor = user.mentor
    print(mentor)
    return {"success": True, "data": {"mentor": mentor.to_dict(show=fields)}}, 200


@mentors.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("skills"))).all()
    Mentor(user_id=user.id, topics=selectedTopics,
           about=data.get("about")).commit()
    return {"success": True}, 200


@mentors.route("/-1", methods=["PUT"])
@auth_required()
def update(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentor = user.mentor

    if mentor is None:
        return {"success": False, "errors": ["User not signed up as mentor"]}, 401

    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("skills"))).all()

    mentor.topics = selectedTopics
    mentor.commit()

    return {"success": True}, 200


# TODO : REMOVE THIS ROUTE
@mentors.route("/verify", methods=["GET"])
@auth_required()
def verify(user=None):
    isMentor = not Mentor.query.filter_by(user_id=user.id).first() is None
    return {"isMentor": isMentor}
