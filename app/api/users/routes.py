from flask import Blueprint, request, session
from app import db, login_token_key_str, Users


blueprint = Blueprint("api_users", __name__, url_prefix="/user")

@blueprint.route("/register", methods=["POST"])
def register():
    data_dict = dict(request.get_json())

    state = Users.register(db,
                           data_dict.get("email"),
                           data_dict.get("password"),
                           data_dict.get("password_repeat"),
                           data_dict.get("first_name"),
                           data_dict.get("last_name"),
                           data_dict.get("department"))
    if state[0]:
        user, login_token = state[1], state[2]
        session[login_token_key_str] = login_token
        return user.get_api_return_data(start_dict={"successful": True})
    else:
        error = state[1]
        return {"successful": False}


@blueprint.route("/login", methods=["POST"])
def login():
    data_dict = dict(request.get_json())

    if login_token_key_str in session:
        return {"successful": False}
    state = Users.login(db, data_dict.get("email"), data_dict.get("password"))
    if state[0]:
        user, login_token = state[1], state[2]
        session[login_token_key_str] = login_token
        return user.get_api_return_data(start_dict={"successful": True})
    else:
        error = state[1]
        return {"successful": False}


@blueprint.route("/logout", methods=["POST"])
def logout():
    if login_token_key_str in session.keys():
        state = Users.logout(db, session.get(login_token_key_str))
        if state:
            session.pop(login_token_key_str)
            return {"successful": True}
        else:
            return {"successful": False}
    else:
        return {"successful": False}


@blueprint.route("/", methods=["GET"])
def get():
    if login_token_key_str in session.keys():
        user = Users.GetBy.login_token(db, session.get(login_token_key_str))
        if user.isLoaded():
            return user.get_api_return_data()
        return {}

