import app.config.DefaultConfigs
import app.filemanager as FileManager

import json, os

# Default file routing will be based on /app
config_path = "config"


def load_config(file_name: str) -> dict:
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not os.path.isabs(file_name):
        file_name = os.path.join(FileManager.get_project_root(), config_path, file_name)

    return json.loads(FileManager.read_file(file_name))


def save_default(file_name: str, data: dict):
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not os.path.isabs(file_name):
        file_name = os.path.join(FileManager.get_project_root(), config_path, file_name)

    if not os.path.exists(file_name):
        with open(file_name, "w") as file:
            file.write(json.dumps(data, sort_keys=True, indent=4))


def load_defaults():
    configs = DefaultConfigs.configs_to_load

    if not os.path.exists(os.path.join(FileManager.get_project_root(), config_path)):
        os.mkdir()

    for file_name, j in configs.items():
        save_default(file_name, j)


load_defaults()
