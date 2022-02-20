import os
from app.utils.path import get_project_root


def read_file(*file_name: str) -> str:
    f_name = os.path.join(*file_name)
    if not os.path.isabs(f_name):
        f_name = os.path.join(get_project_root(), f_name)

    with open(f_name, "r") as file:
        file_content = file.read()

    return file_content
