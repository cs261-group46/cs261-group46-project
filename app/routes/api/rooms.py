from flask import Blueprint, request, session
from app import db
from app.models import Room
from sqlalchemy import func
from app.middleware.auth import auth_required


rooms = Blueprint("api_rooms", __name__, url_prefix="/rooms")


@rooms.route("/", methods=["GET"])
@auth_required()
def index(user=None):
    start_with = request.args.get('startswith').lower()
    rooms = Room.query.filter(func.lower(
        Room.name).startswith(start_with)).limit(5).all()

    print(rooms)
    return {"success": True, "data": {"rooms": [{"id": room.id, "name": room.name} for room in rooms]}}, 200
