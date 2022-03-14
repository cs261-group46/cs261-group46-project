from flask import Blueprint, request
from api.app import db
from api.models import Mentee, Topic, MenteeTopic, PlanOfAction, Notification, MentorFeedback, MenteeFeedback
from api.middleware.auth import auth_required
from api.models.schemas import MenteeSchema
from api.utils.cerberus_helpers import get_errors
from api.utils.marshmallow_helpers import get_results
from api.validators.MenteesValidators import storeValidator, updateValidator

mentees = Blueprint("api_mentees", __name__, url_prefix="/mentees")

@mentees.route("/", methods=["POST"])
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

        is_duplicate = not Mentee.query.filter_by(user_id=user.id).first() is None

        if is_duplicate:
            return {"success": False, "errors": ["User's mentee account already exists."]}, 400

        if data.get("user_id") != user.id:
            return {"success": False, "errors": ["You are not allowed to create mentee accounts on other's behalf."]}

        mentee = Mentee(user_id=user.id, about=data.get("about")).commit()

        selected_topics = Topic.query.filter(Topic.id.in_([interest.get("interest") for interest in data.get("interests")])).all()
        selected_topics_ordered = [next(s for s in selected_topics if s.id == interest.get("interest")) for interest in
                                 sorted(data.get("interests"), key=(lambda i: i.get("priority")))]
        count = 1
        for topic in selected_topics_ordered:
            mentee_topic = MenteeTopic(priority=count)
            mentee_topic.topic = topic
            mentee_topic.mentee = mentee
            db.session.add(mentee_topic)
            count += 1

        db.session.commit()

        Notification(notification_level="info", notification_type="learning", user=mentee.user,
                     description='You have now become a mentee. When you wish to find a mentor, head over to the find "Find a mentor" page, where you can request mentorships from mentors. Once a mentor accepts your request, you will be able to set up your plans of action, track them, set up meetings with your mentor. Meanwhile, headover to the "Explore group sessions" page, where you can explore public group sessions and workshops hosted by experts, or private ones if you have received an invite by an expert.').commit()

        for topic in selected_topics_ordered:
            no_of_mentees_doing_topic = len(topic.mentees)
            if no_of_mentees_doing_topic > 20 and no_of_mentees_doing_topic % 10 == 0:
                for expert in topic.experts:
                    n = Notification(notification_level="alert", notification_type="expertise", user=expert.user, description=f"{topic.name} is a popular interest. Consider running a group session on it.")
                    db.session.add(n)

        db.session.commit()


        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@mentees.route("/<menteeId>", methods=["PUT"])
@auth_required
def update(menteeId=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400

        mentee = Mentee.query.filter_by(id=menteeId).first()

        if mentee is None:
            return {"success": False, "errors": ["Requested mentee not found."]}, 400



        if data.get("interests"):
            if mentee.user.id != user.id:
                return {"success": False, "errors": ["You don't have the permissions to update a mentee account on other's behalf."]}, 401

            selected_topics = Topic.query.filter(Topic.id.in_([interest.get("interest") for interest in data.get("interests")])).all()
            selected_topics_ordered = [next(s for s in selected_topics if s.id == interest.get("interest")) for interest in sorted(data.get("interests"), key=(lambda i: i.get("priority")))]

            MenteeTopic.query.filter_by(mentee_id=menteeId).delete()
            db.session.commit()

            count = 1
            for topic in selected_topics_ordered:
                mentee_topic = MenteeTopic(priority=count)
                mentee_topic.topic = topic
                mentee_topic.mentee = mentee
                db.session.add(mentee_topic)
                count += 1

            db.session.commit()

            Notification(notification_level="info", notification_type="learning", user_id=mentee.user.id,
                         description="Your mentee account details have changed").commit()

            for topic in selected_topics_ordered:
                no_of_mentees_doing_topic = len(topic.mentees)
                if no_of_mentees_doing_topic > 20 and no_of_mentees_doing_topic % 10 == 0:
                    for expert in topic.experts:
                        n = Notification(notification_level="alert", notification_type="expertise", user=expert.user,
                                     description=f"{topic.name} is a popular interest. Consider running a group session on it.")
                        db.session.add(n)

            db.session.commit()

        if "plansofaction" in data:
            if (mentee.user.id != user.id) and (mentee.mentor.user.id != user.id):
                return {"success": False, "errors": ["You don't have the permissions to update a mentee account on other's behalf."]}, 401

            PlanOfAction.query.filter_by(mentee_id=menteeId).delete()
            db.session.commit()

            for plan in data.get("plansofaction"):
                plan_of_action = PlanOfAction(title=plan.get("title"), status=plan.get("status"), mentee_id=mentee.id)
                db.session.add(plan_of_action)

            db.session.commit()
            Notification(notification_level="alert", notification_type="learning", user_id=mentee.user.id,
                         description="Your plans of action have changes.").commit()

        if data.get("mentor"):
            if (mentee.user.id != user.id) and (mentee.mentor.user.id != user.id):
                return {"success": False, "errors": ["You don't have the permissions to update a mentee account on other's behalf."]}, 401

            if data.get("mentor") != -1:
                return {"success": False, "errors": ["Bad request."]}, 400

            if mentee.mentor.user.id == user.id:
                message = f'You have terminated your partnership with your mentee {mentee.user.first_name} {mentee.user.last_name}. Please make sure to provide them with feedback by going to the "Your Mentees" page, and then to the "Past mentees" page.'
                Notification(notification_level="alert", notification_type="mentoring", user_id=user.id,
                             description=message).commit()

                message = 'Your mentor has terminated your partnership. Please make sure to provide them with feedback by going to the "Your Mentor" page, and then to the "Past mentors" page.'
                Notification(notification_level="alert", notification_type="learning", user_id=mentee.user.id,
                             description=message).commit()
            else:
                message = f'Your mentee {mentee.user.first_name} {mentee.user.last_name} has terminated your partnership. Please make sure to provide them with feedback by going to the "Your Mentees" page, and then to the "Past mentees" page.'
                Notification(notification_level="alert", notification_type="mentoring", user_id=mentee.mentor.user.id,
                             description=message).commit()

                message = f'You have terminated your partnership with your mentor. Please make sure to provide them with feedback by going to the "Your Mentor" page, and then to the "Past mentors" page.'
                Notification(notification_level="alert", notification_type="learning", user_id=mentee.user.id,
                             description=message).commit()

            MentorFeedback(mentee_id=mentee.id, mentor_id=mentee.mentor.id, weight=mentee.weight).commit()
            MenteeFeedback(mentee_id=mentee.id, mentor_id=mentee.mentor.id, weight=mentee.weight).commit()

            mentee.mentor = None
            mentee.commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400




@mentees.route("/<menteeId>", methods=["GET"])
@auth_required
def get(menteeId=None, user=None):
    try:
        mentee = Mentee.query.filter_by(id=menteeId).first()

        if mentee is None:
             return {"success": False, "errors": ["Mentee does not exist."]}, 400

        if mentee.user.id != user.id and (mentee.mentor and mentee.mentor.user.id != user.id):
             return {"success": False, "errors": ["You don't have the permission to access the data on other mentees"]}, 401

        result = get_results(MenteeSchema, mentee)

        return {"success": True, "data": {"mentee": result}}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


