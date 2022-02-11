import json
import os
try:
    import config.DefaultConfigs as DefaultConfigs
except Exception as _:
    import app.config.DefaultConfigs as DefaultConfigs

sep = os.path.sep
config_path = "config"


def get_current_abs_path_str() -> str:
    r = os.path.abspath(os.path.curdir)
    if r.endswith(sep):
        r = r[:-1]
    return r


def get_project_root() -> str:
    current_path = get_current_abs_path_str()
    if not(current_path.endswith(sep + "app") or current_path.endswith(sep + "app" + sep)):
        current_path = os.path.join(current_path, "app")
    return current_path


def load_config(file_name: str) -> dict:
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not os.path.isabs(file_name):
        file_name = os.path.join(get_project_root(), config_path, file_name)

    # file_content = None
    with open(file_name, "r") as file:
        file_content = file.read()
    return json.loads(file_content)


def save_default(file_name: str, data: dict):
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not os.path.isabs(file_name):
        file_name = os.path.join(get_project_root(), config_path, file_name)

    if not os.path.exists(file_name):
        with open(file_name, "w") as file:
            file.write(json.dumps(data, sort_keys=True, indent=4))


def load_defaults():
    configs = DefaultConfigs.configs_to_load

    if not os.path.exists(os.path.join(get_project_root(), config_path)):
        os.mkdir()

    for file_name, j in configs.items():
        save_default(file_name, j)


def read_file(file_name: str) -> str:
    if not os.path.isabs(file_name):
        file_name = os.path.join(get_project_root(), file_name)
    # file_content = None
    with open(file_name, "r") as file:
        file_content = file.read()

    print(file_content)
    return file_content