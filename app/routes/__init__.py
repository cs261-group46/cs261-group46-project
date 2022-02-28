from flask import Flask, session
import os

import app.routes.api as APIRoute
import app.routes.verification as VerificationRoute
from app import app
from app.auth import get_user_from_login_token

app.register_blueprint(APIRoute.blueprint)
app.register_blueprint(VerificationRoute.blueprint)


# Open react index.html
@app.errorhandler(404)
def index(error):
    with open(os.path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents

# Refresh authentication token
@app.before_request
def execute_before_requests():
    if "login_token" in session.keys():
        login_token = session.get("login_token")
        if login_token is not None:
            if get_user_from_login_token(login_token) is None:
                session.pop("login_token")
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