from flask import Blueprint, request, session
from app import db
import app.auth as auth
from app.models import User

blueprint = Blueprint("api_users", __name__, url_prefix="/user")


@blueprint.route("/register", methods=["POST"])
def register():
    register_form = dict(request.get_json())

    successful, errors, login_token_value, response_code = auth.register(register_form.get("email"),
                                                                         register_form.get("password"),
                                                                         register_form.get("password_repeat"),
                                                                         register_form.get("first_name"),
                                                                         register_form.get("last_name"),
                                                                         register_form.get("department").get("label"))
    if successful:
        session["login_token"] = login_token_value

    return {"successful": successful, "errors": errors}, response_code


@blueprint.route("/login", methods=["POST"])
def login():
    if "login_token" in session:
        if auth.get_user_from_login_token(session.get("login_token")) is None:
            session.pop("login_token")
        else:
            return {"successful": False, "errors": "Already logged in"}

    register_form = dict(request.get_json())

    successful, errors, login_token_value, response_code = auth.login(register_form.get("email"),
                                                                      register_form.get("password"))

    if successful:
        session["login_token"] = login_token_value

    return {"successful": successful, "errors": errors}, response_code


@blueprint.route("/logout", methods=["POST"])
@auth.auth_required
def logout(user: User):
    if "login_token" not in session:
        return {"successful": False, "errors": "Not logged in"}, 401

    return {"successful": auth.logout(user)}


@blueprint.route("/", methods=["GET"])
@auth.auth_required
def get(user: User):
    return user.get_api_return_data()


from app.routes.api.users.setup import blueprint as api_users_setup_module

blueprint.register_blueprint(api_users_setup_module)
