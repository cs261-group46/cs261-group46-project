from flask import Blueprint, request, session
from app import login_token_key_str, Users


blueprint = Blueprint("api", __name__, url_prefix="/api")


@blueprint.route("/departments/get", methods=["GET"])
def api_departments_get():
    return Users.get_all_departments()


from app.api.users.routes import blueprint as api_users_module

blueprint.register_blueprint(api_users_module)
