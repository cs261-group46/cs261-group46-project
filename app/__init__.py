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

from flask import Flask, request, session, redirect, url_for, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from app.environ import get

# import app.FileManager as FileManager
# import app.config as Config
# import app.SQL as SQL
# import app.user as Users
# from app.ouremail import EMail as Mail

# peper = environ.get('PEPER')
# name = environ.get('NAME')

##########################
# Config Options/Loading #
##########################

# login_token_key_str = "login_token"


# sql_config   = Config.load_config("sql")
# email_config = Config.load_config("ouremail")
# db = SQL.open_connection(sql_config["connection"])

# for sql_file in sql_config["sql_files"]:
#     print(f"Loading SQL file {sql_file}")
#     SQL.load_defaults_2(db, FileManager.read_file("sql", sql_file))

#############
# App setup #
#############


app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = get('SECRET_KEY')
db_user = get('DATABASE_USER')
db_password = get('DATABASE_PASSWORD')
db_database = get('DATABASE_NAME')
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_password}@localhost:5432/{db_database}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)





# if email_config["enabled"]:
#     for key, value in email_config["email_server"].items():
#         app.config[f"MAIL_{key.upper()}"] = value
#
#     Mail.main(True, app, email_config["sender"])
#     Mail.debug = True

###############
# Route setup #
###############


@app.errorhandler(404)
def index(error):
    with open(os.path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents


from app.models import *

from app.api import api
app.register_blueprint(api)



