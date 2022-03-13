from flask import Blueprint
from api.app import db
from api.models import Notification
from api.middleware.auth import auth_required
from api.models.schemas import NotificationSchema
from api.utils.request import parse_args_list

notifications = Blueprint("api_notifications", __name__,
                          url_prefix="/notifications")


@notifications.route("/", methods=["GET"])
@auth_required
def index(user=None):
    try:
        fields = parse_args_list("fields")
        if fields is None or (len(fields) == 1 and fields[0] == ''):
            fields = None

        schema = NotificationSchema(only=fields, many=True)
        result = schema.dump(user.notifications)

        return {"success": True, "data": {"notifications": result}}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@notifications.route("/<notificationId>", methods=["DELETE"])
@auth_required
def destory(user=None, notificationId=None):
    try:
        notification = Notification.query.filter_by(id=notificationId).first()

        if notification is None:
            return {"success": False, "errors": ["The requested notification does not exist."]}, 400

        if notification.user_id != user.id:
            return {"success": False, "errors": ["You don't have the permission to delete this notification."]}, 401

        db.session.delete(notification)
        db.session.commit()
        return {"success": True}, 200

    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

