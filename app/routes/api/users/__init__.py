from flask import Blueprint, request, session
from app import db, login_token_key_str
from app.user import auth
from app.models import Users

blueprint = Blueprint("api_users", __name__, url_prefix="/user")


@blueprint.route("/register", methods=["POST"])
def register():
    data_dict = dict(request.get_json())

    state, a, b = auth.register(db,
                                 data_dict.get("email"),
                                 data_dict.get("password"),
                                 data_dict.get("password_repeat"),
                                 data_dict.get("first_name"),
                                 data_dict.get("last_name"),
                                 data_dict.get("department").get("label"))
    if state:
        user, login_token = a, b
        session[login_token_key_str] = login_token
        return user.get_api_return_data(start_dict={"successful": True})
    else:
        errorType, errorLocation = a, b
        error_keys = ["email", "password", "password_repeat", "first_name", "last_name", "department"]
        r_dict = {"successful": False, "errors": {key: [] for key in error_keys}}
        r_dict["errors"][error_keys[b-1]].append(errorType)


        return r_dict


@blueprint.route("/login", methods=["POST"])
def login():
    data_dict = dict(request.get_json())

    if login_token_key_str in session:
        return {"successful": False}
    state, a, b = auth.login(db, data_dict.get("email"), data_dict.get("password"))
    if state:
        user, login_token = a, b
        session[login_token_key_str] = login_token
        return user.get_api_return_data(start_dict={"successful": True})
    else:
        errorType, errorLocation = a, b
        error_keys = ["email", "password"]
        r_dict = {"successful": False, "errors": {key: [] for key in error_keys}}
        r_dict["errors"][error_keys[b-1]].append(errorType)
        return r_dict


@blueprint.route("/logout", methods=["POST"])
def logout():
    if login_token_key_str in session.keys():
        state = auth.logout(db, session.get(login_token_key_str))
        if state:
            session.pop(login_token_key_str)
            return {"successful": True}
        else:
            return {"successful": False}
    else:
        return {"successful": False}


@blueprint.route("/", methods=["GET"])
def get():
    user: Users.User
    users = Users.session(login_token_key_str, session)
    if user := users.first():
        return user.get_api_return_data()
    return {}
    # if login_token_key_str in session.keys():
    #     user = Users.GetBy.login_token(db, session.get(login_token_key_str))
    #     if user.isLoaded():
    #         return user.get_api_return_data()
    #     return {}
