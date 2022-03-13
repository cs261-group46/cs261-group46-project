from flask import Blueprint, request
from api.middleware.auth import auth_required
from api.app import db
from api.models import Topic, Mentor, Notification, MentorTopic
from api.models.schemas import MentorSchema
from api.utils.cerberus_helpers import get_errors
from api.utils.mentor_reccomendations import get_mentors
from api.utils.request import parse_args_list
from api.validators.MentorsValidators import storeValidator, updateValidator

mentors = Blueprint("api_mentors", __name__, url_prefix="/mentors")

@mentors.route("/", methods=["GET"])
@auth_required
def index(user=None):
    filters = parse_args_list("filters")
    if filters is None or (len(filters) == 1 and filters[0] == ''):
        filters = None

    mentors = Mentor.query.all()

    if "suitable" in filters:
        mentors = get_mentors(mentors, user)

    fields = parse_args_list("fields")
    if fields is None or (len(fields) == 1 and fields[0] == ''):
        fields = None

    schema = MentorSchema(only=fields, many=True)
    result = schema.dump(mentors)

    return {"success": True, "data": {"mentors": result}}, 200


# @mentors.route("/<mentorId>", methods=["GET"])
# @auth_required
# def get(mentorId, user=None):
#     # TODO: VALIDATE
#     fields = parse_args_list("fields")
#
#     mentor = Mentor.query.filter_by(id=mentorId).first()
#
#     if mentor is None:
#         return {"success": False, "errors": ["Mentor does not exist"]}, 400
#
#     schema = MentorSchema(only=fields)
#     result = schema.dump(mentor)
#
#     return {"success": True, "data": {"mentor": result}}, 200


@mentors.route("/", methods=["POST"])
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

        is_duplicate = not Mentor.query.filter_by(user_id=user.id).first() is None

        if is_duplicate:
            return {"success": False, "errors": ["User's mentor account already exists."]}, 400

        if data.get("user_id") != user.id:
            return {"success": False, "errors": ["You are not allowed to create mentor accounts on other's behalf."]}

        mentor = Mentor(user_id=user.id, about=data.get("about"),
                        capacity=data.get("capacity")).commit()

        selected_topics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
        selected_topics_ordered = [next(s for s in selected_topics if s.id == skill.get("skill")) for skill in
                                 sorted(data.get("skills"), key=(lambda i: i.get("priority")))]

        count = 1
        for topic in selected_topics_ordered:
            mentor_topic = MentorTopic(priority=count)
            mentor_topic.topic = topic
            mentor_topic.mentor = mentor
            db.session.add(mentor_topic)
            count += 1
        db.session.commit()

        Notification(notification_level="info", notification_type="mentoring", user_id=data.get("user_id"),
                     description="You've become a mentor. You will be able to build a mentorship partnership with mentees, once you receive and accept a mentorship request. As a mentor for a mentee, you will be able to set and track plans of action of your mentees and set up meetings with them.").commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@mentors.route("/<mentorId>", methods=["PUT"])
@auth_required
def update(mentorId=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400
        mentor = Mentor.query.filter_by(id=mentorId).first()

        if mentor is None:
            return {"success": False, "errors": ["Requested mentor not found."]}, 400

        if mentor.user.id != user.id:
            return {"success": False, "errors": ["You don't have the permissions to update a mentor account on other's behalf."]}, 401


        selected_topics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
        selected_topics_ordered = [next(s for s in selected_topics if s.id == skill.get("skill")) for skill in
                                 sorted(data.get("skills"), key=(lambda i: i.get("priority")))]

        MentorTopic.query.filter_by(mentor_id=mentorId).delete()
        db.session.commit()

        count = 1
        for topic in selected_topics_ordered:
            mentor_topic = MentorTopic(priority=count)
            mentor_topic.topic = topic
            mentor_topic.mentor = mentor
            db.session.add(mentor_topic)
            count += 1

        db.session.commit()

        Notification(notification_level="info", notification_type="mentoring", user=mentor.user,
                     description="Your mentor account details have changed.").commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400