import datetime

from flask import Blueprint, request
from app import Mentee, Topic, MenteeTopic, db, Meeting, User, Notification
from app.middleware.auth import auth_required
from app.models.schemas import MenteeSchema
from app.utils.request import parse_args_list
from datetime import datetime


meetings = Blueprint("api_meetings", __name__, url_prefix="/meetings")

# id = db.Column(db.Integer, primary_key=True)
#     host_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     title = db.Column(db.String(128), nullable=False)
#     date = db.Column(db.DateTime, nullable=False)
#     room_id = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=False)
#     link = db.Column(db.Text, nullable=True)
#     meeting_type = db.Column(db.String(18), db.CheckConstraint(
#         "meeting_type IN ('workshop', 'group session', 'one on one meeting')"))
#     duration = db.Column(db.Integer, nullable=False)
#     capacity = db.Column(db.Integer, nullable=False)

# const body = {
#       title: title,
#       host: userId,
#       room: room,
#       link: link,
#       date: date,
#       startTime: startTime,
#       endTime: endTime,
#       description: description,
#       capacity: capacity,
#       visibility: visibility,
#       type: type,
#       invites: invites,
#     };

@meetings.route("/<meetingID>", methods=["DELETE"])
@auth_required()
def delete(meetingID, user=None):
    # TODO : VALIDATE



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
    meeting_type = data.get("type").get("value")


    if data.get("visibility").get("value") == "public":
        users = User.query.all()
        Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
                link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity")).commit()
        for user in users:
            Notification(notification_level="info", notification_type="learning", user=user,
                         description="An expert scheduled a meeting that might interest you!").commit()

    elif data.get("visibility").get("value") == "private" and len(data.get("invites")) > 0:
        users = User.query.filter(User.id.in_([invite.get("id") for invite in data.get("invites")])).filter(User.email.in_([invite.get("email") for invite in data.get("invites")])).all()
        Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
                link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"),
                invited=users).commit()
        for user in users:
            Notification(notification_level="info", notification_type="learning", user=user,
                         description="An expert invited you to a private meeting that might interest you!").commit()
    else:
        return {"success" : False, "errors" : ["If you wish to make the meeting private, please make sure to provide the emails of invited."]}



    return {"success": True}, 200


