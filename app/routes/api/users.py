from flask import Blueprint, request
from sqlalchemy import func

from app import User, db, Department, Notification
from app.middleware.auth import auth_required
from app.models.schemas import UserSchema
from app.utils.cerberus_helpers import get_errors
from app.utils.marshmallow_helpers import get_results
from app.utils.request import parse_args_list
from app.validators.UsersValidators import updateValidator

users = Blueprint("api_users", __name__, url_prefix="/users")


@users.route("/", methods=["GET"])
@auth_required
def index(user=None):
    try:
        if not request.args.get('startswith') is None:
            if request.args.get('startswith') == "":
                return {"success": True, "data": {"users": []}}, 200

            start_with = request.args.get('startswith').lower()
            return_users = User.query.filter(func.lower(
                User.email).startswith(start_with)).limit(5).all()
        else:
            return_users = User.query.all()

        fields = parse_args_list("fields")
        if fields is None or (len(fields) == 1 and fields[0] == ''):
            fields = None

        schema = UserSchema(only=fields, many=True,
                            exclude=["meeting_feedback", "mentee", "permissions", "notifications", "mentor", "expert",
                                     "meetings_attending", "meetings_hosted", "meetings_invited"])
        result = schema.dump(return_users)

        return {"success": True, "data": {"users": result}}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


@users.route("/<userId>", methods=["PUT"])
@auth_required
def update(userId, user=None):
    try:
        data = dict(request.get_json())
        updateValidator.validate(data)
        if updateValidator.errors:
            return {
                       "success": False,
                       "errors": get_errors(updateValidator)
                   }, 400

        return_user = User.query.filter_by(id=userId).first()

        if return_user is None:
            return {"success": False, "errors": ["The user doesn't exist"]}, 400

        if user.id != return_user.id:
            return {"success": False, "errors": ["You don't have the permissions to change the details of other users."]}, 401

        department = Department.query.filter_by(id=data.get("department").get("id"), name=data.get("department").get("name")).first()

        if department is None:
            return {"success": False, "errors": ["The department doesn't exist."]}, 400

        return_user.first_name = data.get("first_name")
        return_user.last_name = data.get("last_name")
        return_user.department = department
        db.session.add(return_user)
        db.session.commit()


        mentees_in_department = []

        if return_user.mentor:
            for mentee in return_user.mentor.mentees:
                if mentee.user.department.id == department.id:
                    Notification(description="Your mentor changed departments. Now you are in the same department, and so you mentoship partnerhip might not be as effective. Consider changing mentors.", notification_level='warning', notification_type='learning', user_id=mentee.user.id).commit()
                    Notification(
                        description=f"You changed your department. Now you are in the same department as you mentee {mentee.user.first_name} {mentee.user.last_name} and so you mentorship partnership might not be as effective. Consider terminating partnership.",
                        notification_level='warning', notification_type='mentoring', user_id=return_user.user.id).commit()

        if return_user.mentee and return_user.mentee.mentor and return_user.mentee.mentor.user.department.id == department.id:
            Notification(
                description=f"Your mentee {return_user.first_name} {return_user.last_name} changed departments. Now you are in the same department, and so you mentoship partnerhip might not be as effective. Consider terminating partnership.",
                notification_level='warning', notification_type='mentoring', user_id=return_user.mentee.mentor.user.id).commit()
            Notification(
                description=f"You changed your department. Now you are in the same department as you mentor, and so you mentorship partnership might not be as effective. Consider terminating partnership.",
                notification_level='warning', notification_type='learning',
                user_id=return_user.id).commit()

        return {"success": True}, 200
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400


# id = db.Column(db.Integer, primary_key=True)
#     notification_level = db.Column(db.String(10), db.CheckConstraint(
#         "notification_level IN ('warning', 'alert', 'info')"))
#     notification_type = db.Column(db.String(10), db.CheckConstraint(
#         "notification_type IN ('learning', 'mentoring', 'expertise')"))
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#
#     user = db.relationship("User", backref="notifications", lazy=True)


@users.route("/<userId>", methods=["GET"])
@auth_required
def get(userId=None, user=None):
    try:
        return_user = User.query.filter_by(id=userId).first()
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

    if return_user is None:
        return {"success": False, "errors": ["The user doesn't exist"]}, 400

    if user.id != return_user.id:
        return {"success": False, "errors": ["You don't have the permissions to access the requested data"]}, 401

    try:
        result = get_results(UserSchema, return_user)
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

    return {"success": True, "data": {"user": result}}, 200


@users.route("/loggedin/", methods=["GET"])
@auth_required
def get_logged_in(user=None):
    if user is None:
        return {"success": False, "data": {"user": None}}, 400
    return {"success": True, "data": {"user": user.id}}, 200


@users.route("/<userId>")
@auth_required
def destroy(userId=None, user=None):
    try:
        return_user = User.query.filter_by(id=userId).first()
    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400

    if return_user is None:
        return {"success": False, "errors": ["The user doesn't exist"]}, 400

    if user.id != return_user.id:
        return {"success": False, "errors": ["You don't have the permissions to delete the user."]}, 401

    db.session.delete(user)
    db.session.commit()
    return {"success": True}
