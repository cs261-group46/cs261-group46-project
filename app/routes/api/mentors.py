from flask import Blueprint, request
from sqlalchemy import func, any_
from app import db


from app.middleware.auth import auth_required
from app import Topic, Mentor, Notification, MentorTopic
from app.models.MentorshipRequest import MentorshipRequest
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

    # if "suitable" in filters:
    # mentors = mentors.query.
    #     mentors = sort_mentors(mentors, user)

    mentors = mentors.all()
    return {"success": True, "data": {"mentors": [mentor.to_dict(show=fields) for mentor in mentors]}}, 200


@mentors.route("/request/", methods=["POST"])
@auth_required()
def requestMentor(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentor_id = data.get("mentor")

    mentor = Mentor.query.filter_by(id=mentor_id).first()

    MentorshipRequest(mentor_id=mentor.id, user_id=user.id).commit()

    Notification(
        notification_level="alert",
        notification_type="mentoring",
        user_id=mentor.user_id,
        description="You received a new mentorship request!").commit()

    return {"success": True}, 200


@mentors.route("/<mentorId>", methods=["GET"])
@auth_required()
def get(mentorId, user=None):
    fields = request.args.get('fields').split(',')
    # TODO: VALIDATE

    mentor = user.mentor
    print(mentor)
    return {"success": True, "data": {"mentor": mentor.to_dict()}}, 200


@mentors.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("skills"))).all()
    mentor = Mentor(user_id=user.id, about=data.get("about"),
                    capacity=data.get("capacity")).commit()

    count = 1
    for topic in selectedTopics:
        mentor_topic = MentorTopic(priority=count)
        mentor_topic.topic = topic
        mentor_topic.mentor = mentor
        db.session.add(mentor_topic)
        count += 1
    #     db.session.add(mentor_topic)
    #
    db.session.commit()

    print(mentor.topics)

    return {"success": True}, 200


@mentors.route("/<mentorId>", methods=["PUT"])
@auth_required()
def update(mentorId=None, user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentor = Mentor.query.filter_by(id=mentorId).first()

    if mentor is None:
        return {"success": False, "errors": ["Requested mentor not found."]}, 400

    if mentor.user_id != user.id:
        return {"success": False, "errors": ["You don't have the permissions to update a mentor"]}, 401

    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("skills"))).all()

    mentor.topics = selectedTopics
    mentor.commit()

    return {"success": True}, 200


# # TODO : REMOVE THIS ROUTE
# @mentors.route("/verify", methods=["GET"])
# @auth_required()
# def verify(user=None):
#     isMentor = not Mentor.query.filter_by(user_id=user.id).first() is None
#     return {"isMentor": isMentor}
