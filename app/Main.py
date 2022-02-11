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
except Exception as _:
    import config.Config as Config
    import SQL as SQL

environ = os.environ


##########################
# Config Options/Loading #
##########################

sep = os.path.sep

Config.load_defaults()


sql_config = Config.load_config("sql")
db = SQL.create_connection(sql_config["connection"])

for sql_file in sql_config["sql_files"]:
    SQL.load_defaults(db, Config.read_file("sql" + sep + sql_file))

#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = environ.get('SECRET_KEY')




@app.route("/api/helloworld", methods=["GET"])
def api_get_current_time():
    return {"helloworld": "This is working"}


@app.errorhandler(404)
def index(error):
    with open(os.path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents

if __name__ == "__main__":
    app.run()


