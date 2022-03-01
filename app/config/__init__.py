import app.config.DefaultConfigs
from app.utils import file_manager

import json, os

# Default file routing will be based on /app
config_path = "config"


def load_config(file_name: str) -> dict:
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not os.path.isabs(file_name):
        file_name = os.path.join(file_manager.get_project_root(), config_path, file_name)

    return json.loads(file_manager.read_file(file_name))


def save_default(file_name: str, data: dict):
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not os.path.isabs(file_name):
        file_name = os.path.join(file_manager.get_project_root(), config_path, file_name)

    if not os.path.exists(file_name):
        with open(file_name, "w") as file:
            file.write(json.dumps(data, sort_keys=True, indent=4))


def load_defaults():

    config_dir = os.path.abspath(os.path.join(file_manager.get_project_root(), config_path))

    if not os.path.exists(config_dir):
        os.mkdir(config_dir)

    for file_name, json_dict in DefaultConfigs.configs_to_load.items():
        save_default(file_name, json_dict)


load_defaults()
