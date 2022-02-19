import os


def get_current_abs_path_str() -> str:
    return os.path.abspath(os.path.curdir)


def get_project_root() -> str:
    return get_current_abs_path_str()


def read_file(*file_name: str) -> str:
    f_name = os.path.join(*file_name)
    if not os.path.isabs(f_name):
        f_name = os.path.join(get_project_root(), f_name)
    # file_content = None
    with open(f_name, "r") as file:
        file_content = file.read()

    # print(file_content)
    return file_content