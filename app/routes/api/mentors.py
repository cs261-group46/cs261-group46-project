from flask import Blueprint, request
from sqlalchemy import func, any_
from app import db


from app.middleware.auth import auth_required
from app import Topic, Mentor, Notification, MentorTopic
from app.models.MentorshipRequest import MentorshipRequest
from app.models.schemas import MentorSchema
from app.utils.mentor_reccomendations import sort_mentors
from app.utils.request import parse_args_list

mentors = Blueprint("api_mentors", __name__, url_prefix="/mentors")


@mentors.route("/", methods=["GET"])
@auth_required()
def index(user=None):
    print("request received")
    fields = parse_args_list("fields")
    filters = parse_args_list("filters")
    # Need to introduce some filters ?
    mentors = Mentor.query

    # if "suitable" in filters:
    # mentors = mentors.query.
    #     mentors = sort_mentors(mentors, user)

    mentors = mentors.all()

    schema = MentorSchema(only=fields, many=True)
    result = schema.dump(mentors)

    return {"success": True, "data": {"mentors": result}}, 200


@mentors.route("/<mentorId>", methods=["GET"])
# @auth_required()
def get(mentorId, user=None):
    # TODO: VALIDATE
    fields = parse_args_list("fields")

    mentor = Mentor.query.filter_by(id=mentorId).first()

    if mentor is None:
        return {"success": False, "errors": ["Mentor does not exist"]}, 400

    schema = MentorSchema(only=fields)
    result = schema.dump(mentor)

    return {"success": True, "data": {"mentor": result}}, 200


@mentors.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentor = Mentor(user_id=user.id, about=data.get("about"),
                    capacity=data.get("capacity")).commit()

    selectedTopics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
    selectedTopicsOrdered = [next(s for s in selectedTopics if s.id == skill.get("skill")) for skill in
                             sorted(data.get("skills"), key=(lambda i: i.get("priority")))]

    count = 1
    for topic in selectedTopicsOrdered:
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


    selectedTopics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
    selectedTopicsOrdered = [next(s for s in selectedTopics if s.id == skill.get("skill")) for skill in
                             sorted(data.get("skills"), key=(lambda i: i.get("priority")))]

    MentorTopic.query.filter_by(mentor_id=mentorId).delete()
    db.session.commit()

    count = 1
    for topic in selectedTopicsOrdered:
        mentor_topic = MentorTopic(priority=count)
        mentor_topic.topic = topic
        mentor_topic.mentor = mentor
        db.session.add(mentor_topic)
        count += 1

    db.session.commit()

    return {"success": True}, 200


# # TODO : REMOVE THIS ROUTE
# @mentors.route("/verify", methods=["GET"])
# @auth_required()
# def verify(user=None):
#     isMentor = not Mentor.query.filter_by(user_id=user.id).first() is None
#     return {"isMentor": isMentor}
