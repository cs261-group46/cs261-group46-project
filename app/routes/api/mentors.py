from flask import Blueprint, request
from app.middleware.auth import auth_required
from app import Topic, Mentor

mentors = Blueprint("api_mentors", __name__, url_prefix="/mentors")


@mentors.route("", methods=["GET"])
@auth_required()
def get(user=None):
    fields = request.args.get('fields').split(',')
    # TODO: VALIDATE
    mentor = Mentor.query.filter_by(user_id=user.id).first()
    return {"successful": True, "data": {"mentor": mentor.to_dict(show=fields)}}, 200

@mentors.route("", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("skills"))).all()
    Mentor(user_id=user.id, topics=selectedTopics, about=data.get("about")).commit()
    return {"successful" : True}, 200


@mentors.route("", methods=["PUT"])
@auth_required()
def update(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentor = Mentor.query.filter_by(user_id=user.id).first()

    if mentor is None:
        return {"successful" : False}, 401
    
    selectedTopics = Topic.query.filter(Topic.id.in_(data.get("skills"))).all()
    
    mentor.topics = selectedTopics
    mentor.commit()

    return {"successful" : True}, 200



# TODO : REMOVE THIS ROUTE
@mentors.route("/verify", methods=["GET"])
@auth_required()
def verify(user=None):
    isMentor = not Mentor.query.filter_by(user_id=user.id).first() is None
    return {"isMentor": isMentor}

