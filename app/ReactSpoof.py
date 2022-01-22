import os
sep = os.sep


def get_dir_changes():
    original_location = ".."+sep+"build"+sep
    dir_changes = [
        ["static/css", "static/react/css"],
        ["static/js", "static/react/js"],
        ["static/media", "static/react/media"]
    ]

    for bit in os.listdir(original_location):
        if not os.path.isdir(original_location+bit):
            if bit != "index.html":
                dir_changes.append([bit, "static/react/template/"+bit])
    return dir_changes


def load_index():
    with open("../build/index.html", "r") as file:
        file_contents = file.read()
    return spoof_index(file_contents)


def spoof_index(index_html: str) -> str:
    new_file_contents = ""
    index = 0
    max_index = len(index_html)

    while index < max_index:
        changed = False
        for dir_change in get_dir_changes():
            original_dir = dir_change[0]
            new_dir = dir_change[1]

            if not changed:

                if index_html[index:index+len(original_dir)] == original_dir:
                    new_file_contents += new_dir
                    changed = True
                    index += len(original_dir)
        if not changed:
            new_file_contents += index_html[index]

            index += 1

    return new_file_contents


def static_js_sendback(file_name):
    with open("../build/static/"+file_name, "r") as file:
        file_contents = file.read()

    new_file_contents = ""
    index = 0
    max_index = len(file_contents)

    dir_changes = get_dir_changes()

    while index < max_index:
        changed = False
        for dir_change in dir_changes:
            original_dir = dir_change[0]
            new_dir = dir_change[1]

            if not changed:

                if file_contents[index:index+len(original_dir)] == original_dir:
                    new_file_contents += new_dir
                    changed = True
                    index += len(original_dir)
        if not changed:
            new_file_contents += file_contents[index]

            index += 1
    return new_file_contents


def static_sendback(file_name, send_file):
    return send_file("../build/static/" + file_name)


def static_template_sendback(file_name, send_file):
    return send_file("../build/" + file_name)


def load_to_app(app, send_file):
    print("Load to app")

    @app.route("/static/react/template/<path:file_name>")
    def static_react_template_file(file_name: str):
        return static_template_sendback(file_name, send_file)

    @app.route("/static/react/<path:file_name>")
    def static_react_file(file_name: str):
        if file_name.endswith(".js"):
            return static_js_sendback(file_name)
        else:
            return static_sendback(file_name, send_file)

    @app.route("/static/<path:file_name>")
    def static_file(file_name: str):
        app.send_static_file(file_name)

    @app.route('/', methods=["GET"])
    def index():
        return load_index()
