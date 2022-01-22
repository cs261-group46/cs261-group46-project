import psycopg2 as sql

conn = sql._psycopg.connection


def create_connection(loaded_config: dict) -> conn:
    print(loaded_config)

    def connect():
        db_temp_func = sql.connect(host=loaded_config["host"],
                                   database=loaded_config["database"],
                                   port=loaded_config["port"],
                                   user=loaded_config["user"],
                                   password=loaded_config["password"])
        db_temp_func.autocommit = True
        return db_temp_func

    try:
        return connect()
    except sql.OperationalError as e:
        try:
            # Database does not exist, creating
            db_temp = sql.connect(host=loaded_config["host"], port=loaded_config["port"],
                                  user=loaded_config["user"], password=loaded_config["password"])
            db_temp.autocommit = True

            cursor_temp = db_temp.cursor()
            cursor_temp.execute(f"CREATE DATABASE {loaded_config['database']};")
            db_temp.close()
        except:
            print("Impossible to connect")
        else:
            return connect()


def load_defaults(db: conn, schema: str):
    #print(schema)
    i = 0
    l_schema = len(schema)

    space_chars = [" ", "\t", "\n"]

    statement_start = 0
    statement_end = 0
    in_statement = False
    in_not_exit = False

    statements = []

    while i < l_schema:
        current_char = schema[i]
        current_char_pair = schema[i:i + 2]
        if not (current_char in space_chars):
            if in_statement:
                if current_char_pair == "$$":
                    in_not_exit = not in_not_exit
                else:
                    if not in_not_exit:
                        if current_char == ";":
                            statement_end = i
                            in_statement = False
                            statements.append(schema[statement_start:statement_end + 1])
            else:
                statement_start = i
                in_statement = True

        i += 1

    # print("Printing statements")
    cursor = db.cursor()
    for statement in statements:
        # print(statement)
        cursor.execute(statement)
