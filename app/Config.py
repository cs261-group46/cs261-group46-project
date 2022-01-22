import json
import os
sep = os.path.sep
config_path = None


def _get_current_abs_path_str() -> str:
    r = os.path.abspath(os.path.curdir)
    if r.endswith(sep):
        r = r[:-1]
    return r


def get_abs_project_root() -> str:
    current_path = _get_current_abs_path_str()
    back_count = 0
    if current_path.endswith(sep + "app") or current_path.endswith(sep + "app" + sep):
        back_count = 1
    if back_count > 0:
        current_path = sep.join(current_path.split(sep)[:-back_count])
    return current_path


def load_config(file_name: str) -> dict:
    global config_path

    if not file_name.endswith(".json"):
        file_name += ".json"
    if config_path is None:
        config_path = "app" + sep + "config"
    if not os.path.isabs(file_name):
        file_name = get_abs_project_root() + sep + config_path + sep + file_name

    print(file_name)
    file_content = None
    with open(file_name, "r") as file:
        file_content = file.read()
    return json.loads(file_content)


def save_default(file_name: str, data: dict):
    global config_path

    if not file_name.endswith(".json"):
        file_name += ".json"
    if config_path is None:
        config_path = "app" + sep + "config"
    if not os.path.isabs(file_name):
        file_name = get_abs_project_root() + sep + config_path + sep + file_name

    if not os.path.exists(file_name):
        with open(file_name, "w") as file:
            file.write(json.dumps(data, sort_keys=True, indent=4))


def read_file(file_name: str) -> str:
    if not os.path.isabs(file_name):
        file_name = get_abs_project_root() + sep + file_name
    file_content = None
    with open(file_name, "r") as file:
        file_content = file.read()
    return file_content
