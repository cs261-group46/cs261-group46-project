###################################
# CS261 Group Project - Group 46  #
#                                 #
# 19/01/2021 - XX/XX/XXXX         #
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

from flask import Flask, request, session, redirect, url_for, send_file, render_template
from flask_mail import Mail, Message
import os
try:
    import app.Config     as config
    import app.SQL        as sql
except Exception as e:
    import Config     as config
    import SQL        as sql

##########################
# Config Options/Loading #
##########################

config.config_path = "app" + config.sep + "config"
config.save_default("sql", {"connection": {"host": "localhost", "port": "5432", "database": "cs261", "user": "user", "password": ""}, "sql_files": ["schema.sql"]})
config.save_default("email", {"email_server":{"host": "", "port": 0, "use_tls": False, "username": "", "password": ""}, "use_email_notifications": False})
sql_config = config.load_config("sql")
db = sql.create_connection(sql_config["connection"])
for sql_file in sql_config["sql_files"]:
    sql.load_defaults(db, config.read_file("app"+config.sep+"sql"+config.sep+sql_file))

#############
# App setup #
#############

app = Flask(__name__, static_folder="../build/static/", static_url_path="/static")
app.config["SECRET_KEY"] = "va_tLgio5_XvHQ1MTXqn_geISuIBxkctGw3Fmz7cwutYAxq0Xl7twJQAXl£XShE3T8JjWPQCXbSgTXdoV39VMmiSt9ybQ+WIg!i-iHFe+!Bsv!LGN-DvtxVq!dvwHxP9BZ1mo!NTbK£8dzb3£AalqJkQ%W55L+pntywMnz&q6*5yAz02X47f864&KqM+&U=QlbBfYdPe"


@app.route('/')
def index():
    with open(os.path.abspath(f"{app.static_folder}/../index.html"), "r") as file:
        file_contents = file.read()
    return file_contents

@app.route("/api/helloworld", methods=["GET"])
def api_get_current_time():
    return {"helloworld": "This is working"}


@app.route("/login")
def route_login():
    session["test"] = True
    return render_template("Login.html")


@app.route("/logout")
def route_logout():
    if "test" in session.keys():
        print(session["test"])
    else:
        print("Not Found")
    session["test"] = False
    return render_template("Login.html")


if __name__ == "__main__":
    print(app.static_folder)
    print((app.static_folder))
    app.run()


