from flask import Blueprint, request
from app.models import Room
from sqlalchemy import func
from app.middleware.auth import auth_required
from app.models.schemas import RoomSchema
from app.utils.request import parse_args_list

rooms = Blueprint("api_rooms", __name__, url_prefix="/rooms")


@rooms.route("/", methods=["GET"])
@auth_required
def index(user=None):
    try:
        if not request.args.get('startswith') is None:
            if request.args.get('startswith') == "":
                return {"success": True, "data": {"topics": []}}, 200

            start_with = request.args.get('startswith').lower()
            return_rooms = Room.query.filter(func.lower(
                Room.name).startswith(start_with)).limit(5).all()
        else:
            return_rooms = Room.query.all()

        fields = parse_args_list("fields")
        if fields is None or (len(fields) == 1 and fields[0] == ''):
            fields = None

        schema = RoomSchema(only=fields, many=True, exclude=["meetings"])
        result = schema.dump(return_rooms)

        return {"success": True, "data": {"rooms": result}}, 200

    except:
        return {"success": False, "errors": ["An unexpected error occurred"]}, 400
