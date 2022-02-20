from app.sql.connection import conn


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