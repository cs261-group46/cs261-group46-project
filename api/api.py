from flask import Flask
import os

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")

@app.route('/')
@app.route('/reset_password/<token>')
def index():
    #do stuff here
    with open("../build/index.html", "r") as file:
        file_contents = file.read()
    return file_contents


@app.route("/api/helloworld")
def get_current_time():
    return {"helloworld" : "This is working"}


@app.route("/api/reset_password/<token>/verify", methods=["GET"])
def api_reset_password_verify_token(token: str):
    uuid = verify_token(token)
    if uuid is None:
        return {"isValid": False}
    else:
        return {"isValid": True, "uuid": uuid, "email": getEmail(uuid)}


def verify_token(token):
    return None


def getEmail(uuid):
    return f"{uuid}@smpt_mail.i_dont_know_if_this_exists.ru"

if __name__ == "__main__":
    app.run()

