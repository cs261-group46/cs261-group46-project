import datetime

from flask import Blueprint, request
from app import Mentee, Topic, MenteeTopic, db, Meeting, User, Notification
from app.middleware.auth import auth_required
from app.models.schemas import MenteeSchema
from app.utils.request import parse_args_list
from datetime import datetime


meetings = Blueprint("api_meetings", __name__, url_prefix="/meetings")


@meetings.route("/<meetingID>", methods=["PUT"])
@auth_required()
def update(meetingID=None, user=None):
    data = dict(request.get_json())

    # TODO : VALIDATE
    meeting = Meeting.query.filter_by(id=meetingID).first()

    if meeting is None:
        return {"success": False, "errors": ["The requested meeting doesn't exist."]}, 400

    if data.get("user_id") != user.id:
        return {"success": False, "errors": ["You don't have the permission to accept others meeting invites"]}, 401

    if data.get("confirmed"):
        meeting.invited.remove(user)

        meeting.attendees.append(user)
        db.session.commit()

        return {"success": True}, 200

    return {"success": True}, 200


@meetings.route("/<meetingID>", methods=["DELETE"])
@auth_required()
def delete(meetingID=None, user=None):
    # TODO : VALIDATE
    meeting = Meeting.query.filter_by(id=meetingID).first()

    if meeting is None:
        return {"success": False, "errors": ["The requested meeting doesn't exist."]}

    db.session.delete(meeting)
    db.session.commit()
    return {"success": True}


@meetings.route("/", methods=["POST"])
@auth_required()
def store(user=None):
    data = dict(request.get_json())
    # TODO : VALIDATE
    date = datetime.fromisoformat(data.get("date")[:-1] + '+00:00').date()
    start_time = datetime.strptime(data.get("startTime"), '%H:%M')
    endtime_time = datetime.strptime(data.get("endTime"), '%H:%M')

    duration = int((endtime_time - start_time).seconds / 60)
    start_time = start_time.time()

    start_date_time = datetime.combine(date, start_time)

    room_id = data.get("room").get("id")
    meeting_type = data.get("type")

    if data.get("visibility") == "public":
        users = User.query.filter(User.id != user.id).all()
        Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
                link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"), invited=users).commit()
        for user in users:
            Notification(notification_level="info", notification_type="learning", user=user,
                         description="An expert scheduled a meeting that might interest you!").commit()

    elif data.get("visibility") == "private" and len(data.get("invites")) > 0:
        users = User.query.filter(User.id.in_([invite.get("id") for invite in data.get("invites")])).filter(User.email.in_([invite.get("email") for invite in data.get("invites")])).all()
        Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
                link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"),
                invited=users).commit()
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


