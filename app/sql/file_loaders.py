import os

from app.filemanager import read_file, RelativeReader, root_relative_reader
from os import path, sep
from operator import itemgetter

sql_relative_reader = RelativeReader(root_relative_reader, "sql")
sql_extensions: list[str] = ["sql", "osql"]


def read_osql(osql: str):
    # OSQL stands for Other SQL
    file_names = []
    for osql_file_name in osql.split("\n"):
        if osql_file_name:
            if osql_file_name.endswith(f".{sql_extensions[0]}") or osql_file_name.endswith(f".{sql_extensions[1]}"):
                if sql_relative_reader.exists(osql_file_name):
                    file_names.append(osql_file_name)
                else:
                    raise FileNotFoundError(f"File {osql_file_name} does not exist")
    return file_names


def get_file_order_key(file_name: str) -> int:
    full_file_name = file_name
    if os.sep in file_name:
        file_name = file_name.split(os.sep)[-1]
    if "_" in file_name:
        file_start = file_name.split("_", 1)[0]
        try:
            i = int(file_start)
            if i > 99:
                raise IndexError(f"{i} from {full_file_name} is too large")
            return i
        except:
            pass
    return 100  # Unordered


def get_sql_files_for(file_name):
    if file_name.endswith(f".{sql_extensions[0]}"):
        return [file_name]
    elif file_name.endswith(f".{sql_extensions[1]}"):
        return get_osql_subfiles(file_name)
    else:
        return []


def get_osql_subfiles(osql_file_name: str):
    osql_files = read_osql(sql_relative_reader.read_file(osql_file_name))
    r_files = []
    for osql_file in osql_files:
        r_files.append(*get_sql_files_for(osql_file))
    return r_files


def get_executing_files(*file_names):
    build_dict = {}
    for file_name in file_names:
        if file_name.endswith(f".{sql_extensions[0]}") or file_name.endswith(f".{sql_extensions[1]}"):
            key = get_file_order_key(file_name)
            if key not in build_dict.keys():
                build_dict[key] = []

            build_dict[key].append(file_name)

    build_list = [(key, val) for key, val in build_dict.items()]
    build_list.sort(key=itemgetter(0))

    r_data = []
    for i in build_list:
        key, val = i
        for file in val:
            for list_file in get_sql_files_for(file):
                r_data.append(list_file)

    return r_data


def get_schemas_from_file_names(*file_names):
    file_names = get_executing_files(*file_names)
    schemas = []
    for file_name in file_names:
        # print(f"Getting schema from {file_name}")
        schema = sql_relative_reader.read_file(file_name)
        schemas.append(schema)
        # for line in schema.split("\n"):
        #     print(f"\t{line}")
    return schemas




