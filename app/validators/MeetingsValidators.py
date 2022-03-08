# data = dict(request.get_json())
# # TODO : VALIDATE
# date = datetime.fromisoformat(data.get("date")[:-1] + '+00:00').date()
# start_time = datetime.strptime(data.get("startTime"), '%H:%M')
# endtime_time = datetime.strptime(data.get("endTime"), '%H:%M')
#
# duration = int((endtime_time - start_time).seconds / 60)
# start_time = start_time.time()
#
# start_date_time = datetime.combine(date, start_time)
#
# room_id = data.get("room").get("id")
# meeting_type = data.get("type")
#
# if data.get("visibility") == "public":
#     users = User.query.filter(User.id != user.id).all()
#     Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
#             link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"),
#             invited=users).commit()
#     for user in users:
#         Notification(notification_level="info", notification_type="learning", user=user,
#                      description="An expert scheduled a meeting that might interest you!").commit()
#
# elif data.get("visibility") == "private" and len(data.get("invites")) > 0:
#     users = User.query.filter(User.id.in_([invite.get("id") for invite in data.get("invites")])).filter(
#         User.email.in_([invite.get("email") for invite in data.get("invites")])).all()
#     Meeting(host_id=data.get("host"), title=data.get("title"), date=start_date_time, room_id=room_id,
#             link=data.get("link"), meeting_type=meeting_type, duration=duration, capacity=data.get("capacity"),
#             invited=users).commit()
#     for user in users:
#         if meeting_type == "one on one meeting":
#
#             if data.get("as") == "mentee":
#                 Notification(notification_level="alert", notification_type="mentoring", user=user,
#                              description="One of your mentees has invited you to a meeting").commit()
#
#             else:
#                 Notification(notification_level="alert", notification_type="learning", user=user,
#                              description="Your mentor has invited you to a meeting").commit()
#
#         else:
#             Notification(notification_level="info", notification_type="learning", user=user,
#                          description="An expert invited you to a private meeting that might interest you!").commit()
# else:
#     return {"success": False, "errors": [
#         "If you wish to make the meeting private, please make sure to provide the emails of invited."]}, 400
#
# return {"success": True}, 200



from cerberus import Validator

storeValidationRules = {
    "date": {
        "required": True,
        'type': 'string',
        'maxlength': 100
    },
    'description': {
        'required': True,
        'maxlength': 500,
        'type': 'string',
    },
    'startTime': {
        "required": True,
        'type': 'string',
        'maxlength': 100
    },
    'endTime': {
        "required": True,
        'type': 'string',
        'maxlength': 100
    },
    'room': {
        'required': True,
        'type': 'integer',
        'min': 1,
    },
    'type': {
        "required": True,
        'type': 'string',
        'regex': "^(one on one meeting|workshop|group session)$"
    },
    'visibility': {
        "required": True,
        'type': 'string',
        'regex': "^(public|private)$"
    },
    'invites': {
        "required": False,
        'type': 'list',
        'schema': {
            'type': "dict",
            'schema': {
                "id": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                },
                "email": {
                    "type": "string",
                    "required": True
                }
            }
        }

    },
    'host': {
        "type": "integer",
        "min": 1,
        "required": True
    },
    'title': {
        "type": "string",
        "required": True,
        'minlength': 1,
        'maxlength': 500
    },
    'link': {
        'required': False,
        "type": "string",
        'maxlength': 500
    },
    'capacity': {
        "type": "integer",
        'required': False,
    },
    'topics': {
        'type': 'list',
        'required': False,
        'schema': {
            'type': 'integer',
            'required': True,
            'min': 1
        }
    },
    'as': {
        'required': False,
        "type": "string",
        "regex": "^(mentor|mentee)$",
    }
}

updateValidationRules = {
    'user_id': {
         'required': True,
         'type': 'integer',
         'min': 1
    },
    'confirmed': {
        'required': True,
        'type': 'boolean',
    }
}

storeValidator = Validator(storeValidationRules)
updateValidator = Validator(updateValidationRules)
