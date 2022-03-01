from flask import Blueprint, request
from app import Notification, db
from app.middleware.auth import auth_required

notifications = Blueprint("api_notifications", __name__,
                          url_prefix="/notifications")


@notifications.route("/-1", methods=["GET"])
@auth_required()
def index(user=None):
    fields = []

    if request.args:
        fields = [] if request.args.get(
            'fields') is None else request.args.get('fields').split(',')

    return {"data": {"notifications": [notification.to_dict(show=fields) for notification in user.notifications]}}, 200


@notifications.route("/<notificationId>", methods=["DELETE"])
@auth_required()
def destory(user=None, notificationId=None):
    # TODO : Validate

    notification = Notification.query.filter_by(id=notificationId).first()

    db.session.delete(notification)
    db.session.commit()

    # fields = []

    # if request.args:
    #     fields = [] if request.args.get(
    #         'fields') is None else request.args.get('fields').split(',')

    # return {"data": {"notifications": [notification.to_dict(show=fields) for notification in user.notifications]}}, 200
    return {"success": True}
