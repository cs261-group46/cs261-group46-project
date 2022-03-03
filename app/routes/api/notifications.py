from flask import Blueprint, request
from app import Notification, db
from app.middleware.auth import auth_required
from app.models.schemas import NotificationSchema
from app.utils.request import parse_args_list

notifications = Blueprint("api_notifications", __name__,
                          url_prefix="/notifications")


@notifications.route("/", methods=["GET"])
@auth_required()
def index(user=None):
    fields = parse_args_list("fields")

    schema = NotificationSchema(only=fields, many=True)
    result = schema.dump(user.notifications)

    return {"success": True, "data": {"notifications": result}}, 200


@notifications.route("/<notificationId>", methods=["DELETE"])
@auth_required()
def destory(user=None, notificationId=None):
    # TODO : Validate

    notification = Notification.query.filter_by(id=notificationId).first()

    if (notification.user_id != user.id):
        return {"success": False, "errors": ["You don't have the permission to delete this notification."]}, 401

    db.session.delete(notification)
    db.session.commit()
    return {"success": True}, 200
