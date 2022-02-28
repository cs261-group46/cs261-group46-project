from flask import Blueprint, request, session
from app import db, Room

blueprint = Blueprint("api_meetings", __name__, url_prefix="/meetings")


@blueprint.route("/")
def expert():
    return "NotImplemented"


@blueprint.route("/rooms", methods=["GET"])
def get_rooms():
    if (startswith := request.args.get("startwith")) is None:
        startswith = ""
    rooms = Room.query.filter(Room.name.ilike(f"{startswith}%")).all()
    return {"result": [{"id": room.id, "label": room.name} for room in rooms]}
