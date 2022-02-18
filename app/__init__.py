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
import app.environ as environ
import app.FileManager as FileManager
import app.config as Config
import app.SQL as SQL
import app.user as Users

peper = environ.get('PEPER')


##########################
# Config Options/Loading #
##########################

login_token_key_str = "login_token"


sql_config = Config.load_config("sql")
db = SQL.open_connection(sql_config["connection"])

for sql_file in sql_config["sql_files"]:
    SQL.load_defaults(db, FileManager.read_file("sql", sql_file))

#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = environ.get('SECRET_KEY')


###############
# Route setup #
###############


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
            user = Users.GetUserBy.login_token(db, login_token)  # Refresh auth token


from app.api.routes import blueprint as api_module

app.register_blueprint(api_module)



