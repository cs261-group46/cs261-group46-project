import psycopg2 as sql
import loadDummyData

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
        loadDummyData.fillDatabase(connect())
        return connect()
    except sql.OperationalError as e1:
        try:
            # Database does not exist, creating
            db_temp = sql.connect(host=loaded_config["host"], port=loaded_config["port"],
                                  user=loaded_config["user"], password=loaded_config["password"], database="template1")
            db_temp.autocommit = True

            print(f"Creating database {loaded_config['database']}")

            cursor_temp = db_temp.cursor()
            cursor_temp.execute(f"CREATE DATABASE {loaded_config['database']};")
            db_temp.close()
        except Exception as e2:
            print("Impossible to connect")
            print(e1)
            print(e2)
        else:
            print(f"Created Database {loaded_config['database']}, reconnecting")
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
    # cursor.execute(schema)

def is_valid_input(*args) -> bool:
    def validate(a):
        if a is None:
            return False
        if "'" in a:
            return False
        return True

    if len(args) == 1:
        if isinstance(args[0], str):
            return validate(args[0])
        else:
            for sa in args[0]:
                if not validate(sa):
                    return False
            return True
    else:
        for arg in args:
            if not is_valid_input(arg):
                return False
        return True


