import psycopg2
import psycopg2.extras

psycopg2.extras.register_uuid()
conn = psycopg2._psycopg.connection


def open_connection(loaded_config: dict) -> conn:
    print("Opening SQL connection")
    c = create_connection(loaded_config)
    if c is None:
        raise psycopg2.Error("Failed to connect to database")
    return c


def create_connection(loaded_config: dict) -> conn:
    # print(loaded_config)

    def connect():
        db_temp_func = psycopg2.connect(host=loaded_config["host"],
                                        database=loaded_config["database"],
                                        port=loaded_config["port"],
                                        user=loaded_config["user"],
                                        password=loaded_config["password"])
        db_temp_func.autocommit = True
        return db_temp_func

    try:
        return connect()
    except psycopg2.OperationalError as e1:
        try:
            # Database does not exist, creating
            db_temp = psycopg2.connect(host=loaded_config["host"], port=loaded_config["port"],
                                       user=loaded_config["user"], password=loaded_config["password"],
                                       database="template1")
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
