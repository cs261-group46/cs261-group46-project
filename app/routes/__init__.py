import app.routes.api as APIRoute
import app.routes.verification as VerificationRoute
from flask import Flask, session
import os

from app import login_token_key_str, db
from app.models import Users


def load_routes(app: Flask):
    app.register_blueprint(APIRoute.blueprint)
    app.register_blueprint(VerificationRoute.blueprint)

    @app.errorhandler(404)
    def index(error):
        with open(os.path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
            file_contents = file.read()
        return file_contents

    @app.before_request
    def execute_before_requests():
        if login_token_key_str in session.keys():
            login_token = session.get(login_token_key_str)
            if not (login_token is None):
                user = Users.select(login_token=login_token).first()
                if user is None:
                    session.pop(login_token_key_str)
                # Users.GetBy.login_token(db, login_token)  # Refresh auth token

    @app.after_request
    def execute_after_requests(response):
        # change response code on unsuccessful responses
        # TODO: move this to where response is actually called
        try:
            data = response.get_json()
            if data and "successful" in data and not data["successful"]:
                response.status = 400
        except:
            pass

        response.headers["Access-Control-Allow-Origin"] = "*"
        return response