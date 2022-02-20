import os


def get_current_abs_path_str() -> str:
    return os.path.abspath(os.path.curdir)


def get_project_root() -> str:
    current_path = get_current_abs_path_str()
    if current_path.endswith(os.sep+"app") or current_path.endswith(os.sep+"app"+os.sep):
        return current_path
    else:
        if "app" in os.listdir(current_path):
            return os.path.join(current_path, "app")
        else:
            raise FileNotFoundError("Current directory does not know /app")
