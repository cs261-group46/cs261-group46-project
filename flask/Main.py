from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    with open("templates/react/index.html", "r") as file:
        file_contents = file.read()
    return file_contents


@app.route("/api/helloworld")
def get_current_time():
    return {"helloworld" : "This is working"}


if __name__ == "__main__":
    app.run()


print(app.template_folder, app.static_folder, app.static_url_path)