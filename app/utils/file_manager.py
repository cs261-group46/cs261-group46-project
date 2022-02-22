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


class RelativeReader:
    def __init__(self, *root):
        if len(root) > 0:
            if not isinstance(root[0], RelativeReader):
                if os.path.isabs(abs_root := os.path.join(*root)):
                    self.root = abs_root
                    return
        root_creation: str
        if len(root) > 0 and isinstance(root[0], RelativeReader):
            root_reader: RelativeReader = root[0]
            root_creation = root_reader.get_abs_path()
            root = root[1:]
        else:
            root_creation = get_project_root()
        self.root = os.path.join(root_creation, *root)

    def read_file(self, *file_name) -> str:
        with open(self.get_abs_path(*file_name), "r") as file:
            file_content = file.read()
        return file_content

    def exists(self, *file_name) -> bool:
        return os.path.exists(self.get_abs_path(*file_name))

    def get_abs_path(self, *elements) -> str:
        if len(elements) > 0:
            full_path = os.path.join(*elements)
        else:
            full_path = ""

        if not os.path.isabs(full_path):
            full_path = os.path.join(self.root, full_path)
        return os.path.abspath(full_path)

    def list_directory(self, *elements, with_root=False, extensions=None):
        if extensions is None:
            extensions = []

        original_path = os.path.join(*elements)
        abs_path = self.get_abs_path(*elements)
        if os.path.exists(abs_path):
            if os.path.isdir(abs_path) or os.path.isdir(abs_path + os.sep):
                dir_contents = os.listdir(abs_path)
                if with_root:
                    to_return = [os.path.join(original_path, dir_file_name) for dir_file_name in os.listdir(abs_path)]
                else:
                    to_return = os.listdir(abs_path)
                for f in to_return.copy():
                    valid_extension = False
                    for extension in extensions:
                        if f.endswith(f".{extension}"):
                            valid_extension = True
                    if not valid_extension:
                        to_return.remove(f)
                return to_return

            else:
                raise TypeError(f"Path {abs_path} is not a directory")
        else:
            raise TypeError(f"Path {abs_path} does not exists")

    def path_exists(self, *elements):
        return os.path.exists(self.get_abs_path(*elements))

    def move(self, source_file, destination_dir):
        abs_source_file = self.get_abs_path(source_file)
        abs_destination_dir = self.get_abs_path(destination_dir)
        if not os.path.isdir(abs_destination_dir):
            raise FileNotFoundError(f"{abs_destination_dir} is not a dir")
        if not os.path.isfile(abs_source_file):
            raise FileNotFoundError(f"{abs_source_file} is not a file")

        source_file_name: str = abs_source_file.split(os.sep)[-1]
        abs_destination_file = os.path.join(abs_destination_dir, source_file_name)
        os.rename(abs_source_file, abs_destination_file)


root_relative_reader = RelativeReader()
read_file = root_relative_reader.read_file

