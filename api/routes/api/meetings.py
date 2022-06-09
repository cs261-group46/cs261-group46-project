import datetime

from flask import Blueprint, request
from api.app import db
from api.models import Meeting, User, Notification, Topic
from api.middleware.auth import auth_required
from datetime import datetime

from api.utils.cerberus_helpers import get_errors
from api.validators.MeetingsValidators import storeValidator, updateValidator

meetings = Blueprint("api_meetings", __name__, url_prefix="/meetings")


@meetings.route("/<meetingID>", methods=["PUT"])
@auth_required
def update(meetingID=None, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400

        meeting = Meeting.query.filter_by(id=meetingID).first()

        if meeting is None:
            return {"success": False, "errors": ["The requested meeting doesn't exist."]}, 400

        if data.get("user_id") != user.id:
            return {"success": False, "errors": ["You don't have the permission to accept others meeting invites"]}, 401

        if data.get("confirmed") and len(meeting.attendees) < meeting.capacity:
            meeting.invited.remove(user)

            meeting.attendees.append(user)
            db.session.commit()

            return {"success": True}, 200

        if not data.get("confirmed"):
            meeting.invited.remove(user)
            db.session.commit()

        return {"success": True}, 200

    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@meetings.route("/<meetingID>", methods=["DELETE"])
@auth_required
def delete(meetingID=None, user=None):
    try:
        meeting = Meeting.query.filter_by(id=meetingID).first()

        if meeting is None:
            return {"success": False, "errors": ["The requested meeting doesn't exist."]}, 400

        if meeting.host_id != user.id:
            return {"success": False, "errors": ["You do not have the permission to remove others meetings"]}, 401

        db.session.delete(meeting)
        db.session.commit()
        return {"success": True}
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400



@meetings.route("/", methods=["POST"])
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
        try:
            date = datetime.fromisoformat(data.get("date")[:-1] + '+00:00').date()
        except:
            return {"success": False, "errors": ["Date was given in the wrong format."]}, 400
        try:
            start_time = datetime.strptime(data.get("startTime"), '%H:%M')
        except:
            return {"success": False, "errors": ["Start time was given in the wrong format."]}, 400
        try:
            endtime_time = datetime.strptime(data.get("endTime"), '%H:%M')
        except:
            return {"success": False, "errors": ["End time was given in the wrong format."]}, 400

        duration = int((endtime_time - start_time).seconds / 60)

        start_time = start_time.time()
        end_time = endtime_time.time()

        start_date_time = datetime.combine(date, start_time)
        end_date_time = datetime.combine(date, end_time)

        if end_date_time <= start_date_time:
            return {"success": False, "errors": ["End time before start time."]}, 400

        if start_date_time <= datetime.now():
            return {"success": False, "errors": ["Start date and time needs to be in the future"]}, 400


        room_id = None if not data.get("room") else data.get("room")
        capacity = None if not data.get("capacity") else data.get("capacity")
        link = None if not data.get("link") else data.get("link")

        if (not ((capacity and room_id) or link)):
            return {"success": False, "errors": ["For in person events - please specify the room and capacity. For online events - please specify the link."]}, 400


        meeting_type = data.get("type")

        if data.get("visibility") == "public":
            users = User.query.filter(User.id != user.id).all()
            meeting = Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
                    link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"), invited=users, description=data.get("description")).commit()

            if data.get("topics"):
                for t in data.get("topics"):
                    topic = Topic.query.filter_by(id=t).first()
                    if topic:
                        meeting.topics.append(topic)

            meeting.commit()


            for user in users:
                Notification(notification_level="info", notification_type="learning", user=user,
                             description="An expert scheduled a meeting that might interest you!").commit()

        elif data.get("visibility") == "private" and len(data.get("invites")) > 0:
            # noinspection PyUnresolvedReferences
            users = User.query.filter(User.id.in_([invite.get("id") for invite in data.get("invites")])).filter(User.email.in_([invite.get("email") for invite in data.get("invites")])).all()
            meeting = Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
                    link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"),
                    invited=users, description=data.get("description")).commit()

            if data.get("topics"):
                for t in data.get("topics"):
                    topic = Topic.query.filter_by(id=t).first()
                    if topic:
                        meeting.topics.append(topic)

            meeting.commit()

            for user in users:
                if meeting_type == "one on one meeting":

                    if data.get("as") == "mentee":
                        Notification(notification_level="alert", notification_type="mentoring", user=user,
                                     description="One of your mentees has invited you to a meeting").commit()

                    else:
                        Notification(notification_level="alert", notification_type="learning", user=user,
                                     description="Your mentor has invited you to a meeting").commit()

                else:
                    Notification(notification_level="info", notification_type="learning", user=user,
                             description="An expert invited you to a private meeting that might interest you!").commit()
        else:
            return {"success": False, "errors": ["If you wish to make the meeting private, please make sure to provide the emails of invited."]}, 400

        return {"success": True}, 200

    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

