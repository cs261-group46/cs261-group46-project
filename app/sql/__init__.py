from app.sql.connection import open_connection, create_connection, conn
from app.sql.validator import is_valid_input
from app.sql.file_loaders import sql_relative_reader, get_executing_files, get_schemas_from_file_names
from app.sql.schema_loaders import load_schema, load_schemas


def launch(db: conn, reset=False):
    before_first_launch_dir_files = sql_relative_reader.list_directory("first_launch", "to_execute", "before_launch", with_root=True)
    reset_dir_files = sql_relative_reader.list_directory("reset", with_root=True)
    launch_dir_files = sql_relative_reader.list_directory("launch", with_root=True)
    after_first_launch_dir_files = sql_relative_reader.list_directory("first_launch", "to_execute", "after_launch", with_root=True)

    before_first_launch_files = get_executing_files(*before_first_launch_dir_files)
    reset_files = get_executing_files(*reset_dir_files)
    launch_files = get_executing_files(*launch_dir_files)
    after_first_launch_files = get_executing_files(*after_first_launch_dir_files)

    before_first_launch_schemas = get_schemas_from_file_names(*before_first_launch_files)
    reset_schemas = get_schemas_from_file_names(*reset_files)
    launch_schemas = get_schemas_from_file_names(*launch_files)
    after_first_launch_schemas = get_schemas_from_file_names(*after_first_launch_files)

    load_schemas(db, before_first_launch_schemas)
    if reset:
        load_schemas(db, reset_schemas)
    load_schemas(db, launch_schemas)
    load_schemas(db, after_first_launch_schemas)

    for before_first_launch_file in before_first_launch_dir_files:
        sql_relative_reader.move(before_first_launch_file, "first_launch/executed/before_launch")

    for after_first_launch_file in after_first_launch_dir_files:
        sql_relative_reader.move(after_first_launch_file, "first_launch/executed/after_launch")





