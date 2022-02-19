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
import os
import app.environ as environ
import app.filemanager as FileManager
import app.config as Config
import app.SQL as SQL
from app.email import EMail as Mail, register as MailRegister
import app.user as Users


peper = environ.get('PEPER')
name = environ.get('NAME')

##########################
# Config Options/Loading #
##########################

login_token_key_str = "login_token"

# ALL THE FOLLOWING HAS WORKED FOR SEVERAL WEEKS, DON'T BREAK IT

sql_config   = Config.load_config("sql")
email_config = Config.load_config("email")
db = SQL.open_connection(sql_config["connection"])

schemas: list[str] = [filemanager.read_file("sql", sql_file) for sql_file in sql_config["sql_files"]]
SQL.load_defaults_3(db, schemas, reset=False)

load_factories = False
if load_factories:
    SQL.load_defaults_3(db, [filemanager.read_file("sql/factories", sql_file) for sql_file in ["departments_factory.sql", "topics_factory.sql"]])

#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = environ.get('SECRET_KEY')

if email_config["enabled"]:
    for key, value in email_config["email_server"].items():
        app.config[f"MAIL_{key.upper()}"] = value

    Mail.main(True, app, email_config["sender"])
    Mail.debug = True

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
            Users.GetBy.login_token(db, login_token)  # Refresh auth token


from app.routes import APIRoute

app.register_blueprint(APIRoute.routes.blueprint)



