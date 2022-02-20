from app.sql.connection import conn


def load_schema(db: conn, schema: str):
    # print("Loading schema")
    # for line in schema.split("\n"):
    #     print(f"\t{line}")
    # print("Loaded")
    if schema:
        if schema.startswith("DROP"):
            print("RESET SCHEMA")
        try:
            cursor = db.cursor()
            cursor.execute(schema)
        except Exception as e:
            print(schema)
            raise Exception("ERROR Loading Schema")


def load_schemas(db: conn, schemas: list[str]):
    for schema in schemas:
        load_schema(db, schema)
