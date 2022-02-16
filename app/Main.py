###################################
# CS261 Group Project - Group 46  #
#                                 #
# 19/01/2022 - XX/XX/XXXX         #
# Version: 0.1                    #
#                                 #
# Pip install:                    #
#   flask                         #
#   flask-mail                    #
#   flask-wtf                     #
#   passlib                       #
#   psycopg2                      #
#   gunicorn                      #
###################################

###########
# Imports #
###########

from flask import Flask, request, session, redirect, url_for, send_file
from flask_mail import Mail, Message
import os
try:
    # import app.Config as config
    import app.config.Config as Config
    import app.SQL as SQL
    import app.Users as Users
except Exception as _:
    import config.Config as Config
    import SQL as SQL
    import Users as Users

environ = os.environ
secret_key = environ.get('SECRET_KEY')
peper = environ.get('PEPER')
if peper is None:
    peper = "B1a5KEbbMThr2Klsat2XUyZWXegayfq9"
if secret_key is None:
    secret_key = "va_tLgio5_XvHQ1MTXqn_geISuIBxkctGw3Fmz7cwutYAxq0Xl7twJQAXl£XShE3T8JjWPQCXbSgTXdoV39VMmiSt9ybQ"

##########################
# Config Options/Loading #
##########################

sep = os.path.sep
login_token_key_str = "login_token"

Config.load_defaults()


sql_config = Config.load_config("sql")
db = SQL.create_connection(sql_config["connection"])

for sql_file in sql_config["sql_files"]:
    SQL.load_defaults(db, Config.read_file("sql" + sep + sql_file))

###############################
# Loading variables to python #
###############################
Users.SQL = SQL
Users.db = db
Users.peper = peper
Users.PasswordHashing.secret_key = secret_key

#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = secret_key

###############
# Route setup #
###############


@app.route("/api/helloworld", methods=["GET"])
def api_get_current_time():
    return {"helloworld": "This is working"}


@app.route("/api/user/register", methods=["POST"])
def api_user_register():
    print(dict(request.args))
    print(dict(request.form))
    print(dict(request.get_json()))
    data_dict = dict()  # Not yet sure where the data will be located. You can try to use one of the above

    state = Users.register(data_dict.get("email"),
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
        return {"successful": False, "error": error}


@app.route("/api/user/login", methods=["POST"])
def api_user_login():
    print(dict(request.args))
    print(dict(request.form))
    print(dict(request.get_json()))
    data_dict = dict()  # Not yet sure where the data will be located. You can try to use one of the above

    if login_token_key_str in session:
        return {"successful": False, "error": "User already loged in"}
    state = Users.login(data_dict.get("email"), data_dict.get("password"))
    if state[0]:
        user, login_token = state[1], state[2]
        session[login_token_key_str] = login_token
        return user.get_api_return_data(start_dict={"successful": True})
    else:
        error = state[1]
        return {"successful": False, "error": error}


@app.route("/api/user/logout", methods=["POST"])
def api_user_logout():
    if login_token_key_str in session.keys():
        state = Users.logout(session.get(login_token_key_str))
        if state:
            session.pop(login_token_key_str)
            return {"successful": True}
        else:
            return {"successful": False, "error": "User not found"}
    else:
        return {"successful": False, "error": "User not logged in"}


@app.errorhandler(404)
def index(error):
    with open(os.path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents


@app.before_request
def execute_before_requests():
    if login_token_key_str in session.keys():
        login_token = session.get(login_token_key_str)
        user = Users.GetUserBy.login_token(login_token)  # Refresh auth token


if __name__ == "__main__":
    app.run(debug=False)  # I have disabled the flask dev server, just change this to True if you want it back
    print("Done")


