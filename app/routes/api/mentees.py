from flask import Blueprint, request
from app import Mentee, Topic, MenteeTopic, db, PlanOfAction
from app.middleware.auth import auth_required
from app.models.schemas import MenteeSchema
from app.utils.request import parse_args_list

mentees = Blueprint("api_mentees", __name__, url_prefix="/mentees")


@mentees.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE
    mentee = Mentee(user_id=user.id, about=data.get("about")).commit()

    selectedTopics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
    selectedTopicsOrdered = [next(s for s in selectedTopics if s.id == skill.get("skill")) for skill in
                             sorted(data.get("skills"), key=(lambda i: i.get("priority")))]

    count = 1
    for topic in selectedTopicsOrdered:
        mentee_topic = MenteeTopic(priority=count)
        mentee_topic.topic = topic
        mentee_topic.mentee = mentee
        db.session.add(mentee_topic)
        count += 1
    #     db.session.add(mentor_topic)
    #
    db.session.commit()

    return {"success": True}, 200


@mentees.route("/<menteeId>", methods=["PUT"])
@auth_required()
def update(menteeId=None, user=None):
    data = dict(request.get_json())
    # TODO: VALIDATE

    mentee = Mentee.query.filter_by(id=menteeId).first()

    if mentee is None:
        return {"success": False, "errors": ["Requested user not found."]}, 400

    if data.get("interests"):
        if mentee.user.id != user.id:
            return {"success": False, "errors": ["You don't have the permissions to update a mentee"]}, 401
        selectedTopics = Topic.query.filter(Topic.id.in_([interest.get("interest") for interest in data.get("interests")])).all()
        selectedTopicsOrdered = [next(s for s in selectedTopics if s.id == interest.get("interest")) for interest in sorted(data.get("interests"), key=(lambda i: i.get("priority")))]

        MenteeTopic.query.filter_by(mentee_id=menteeId).delete()
        db.session.commit()

        count = 1
        for topic in selectedTopicsOrdered:
            mentee_topic = MenteeTopic(priority=count)
            mentee_topic.topic = topic
            mentee_topic.mentee = mentee
            db.session.add(mentee_topic)
            count += 1

        db.session.commit()
        return {"success": True}, 200
    elif data.get("plansofaction"):
        if (mentee.user.id != user.id) and (mentee.mentor.user.id != user.id):
            return {"success": False, "errors": ["You don't have the permissions to update a mentee"]}, 401

        PlanOfAction.query.filter_by(mentee_id=menteeId).delete()
        db.session.commit()

        for plan in data.get("plansofaction"):
            plan_of_action = PlanOfAction(title=plan.get("title"), status=plan.get("status"), mentee_id=mentee.id)
            db.session.add(plan_of_action)

        db.session.commit()

        return {"success": True}, 200

    return {"success": False, "errors": ["The indicated data could not be updated"]}, 400




@mentees.route("/<menteeId>", methods=["GET"])
@auth_required()
def get(menteeId=None, user=None):
    # TODO : VALIDATE
    fields = parse_args_list("fields")

    mentee = Mentee.query.filter_by(id=menteeId).first()

    if mentee is None:
         return {"success": False, "errors": ["Mentor does not exist"]}, 400

    schema = MenteeSchema(only=fields)
    result = schema.dump(mentee)

    return {"success": True, "data": {"mentee": result}}, 200



# @mentees.route("", methods=["GET"])
# @token_required
# def get():
#     return {"mentees": }
