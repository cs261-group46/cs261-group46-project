from app import db
from app.models.utils.fake_alchemy.ColumnTypes import Integer, Text, VarChar, Boolean, Timestamp, UUID
from app.models.utils.fake_alchemy.ColumnTypes import Serial, Reference, Ref

from app.models.utils.fake_alchemy import Model, Column, Schema


def get_table_columns(table_name: str):
    statement = f"SELECT * FROM information_schema.columns WHERE table_name = '{table_name}' ORDER BY ordinal_position;"
    cursor = db.cursor()
    cursor.execute(statement)

    data = {}
    schema_name = None
    for row in cursor.fetchall():
        if not schema_name:
            schema_name = row[1]

        column_type = row[7]
        match column_type:
            case "character varying":
                column_type = f"varchar({row[8]})"
        data[row[3]] = {"data_type": column_type, "default":bool(row[5])}

        if row[6] == "YES":
            data[row[3]]["nullable"] = True
        else:
            data[row[3]]["nullable"] = False

    return schema_name, data


def get_primary_keys_and_uniques(schema_name:str, table_name: str):
    statement = f"""SELECT c.oid, c.relname, a.attname, a.attnum, i.indisprimary, i.indisunique
FROM pg_index AS i, pg_class AS c, pg_attribute AS a
WHERE i.indexrelid = c.oid AND i.indexrelid = a.attrelid AND i.indrelid = '{schema_name}.{table_name}'::regclass
ORDER BY c.oid, a.attnum;"""

    cursor = db.cursor()
    cursor.execute(statement)
    data = {}
    for row in cursor.fetchall():
        data[row[2]] = {"primary_key": row[4], "unique": row[5]}

    return data


def get_foreign_keys(schema_name:str, table_name: str):
    statement = f"""SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='{schema_name}' AND tc.table_name='{table_name}';"""

    cursor = db.cursor()
    cursor.execute(statement)
    data = {}
    for row in cursor.fetchall():
        data[row[3]] = {"foreign_table_name": row[5], "foreign_column_name": row[6]}
    return data


def create_column(column_name, data):
    col_type = None
    match data["data_type"]:
        case "integer":
            if data["primary_key"]:
                col_type = Serial
            else:
                col_type = Integer
        case "uuid":
            col_type = UUID
        case "text":
            col_type = Text
        case "timestamp" | "timestamp without time zone":
            col_type = Timestamp
        case "boolean":
            col_type = Boolean
        case _:
            if data["data_type"].startswith("varchar(") and data["data_type"].endswith(")"):
                col_type = VarChar(int(data["data_type"][8:-1]))
            else:
                raise Exception(f"TYPE {data['data_type']}")
    if data["foreign_key"]:
        if (referencing_class := Schema.model_classes.get(data["foreign_table"])) is not None:
            col_type = Reference(referencing_class)
    return Column(col_type, primary_key=data["primary_key"], default=data["default"], nullable=data["nullable"], unique=data["unique"])


loaded = {}


def main(table_name: str):
    if table_name not in loaded:
        loaded[table_name] = main2(table_name)
    return loaded[table_name]


def main2(table_name: str):
    schema_name, data_1 = get_table_columns(table_name)
    data_2 = get_primary_keys_and_uniques(schema_name, table_name)
    data_3 = get_foreign_keys(schema_name, table_name)

    data_aggregate = {}

    for col_name in data_1:
        unique, primary_key = False, False
        if (d2 := data_2.get(col_name)) is not None:
            unique = d2["unique"]
            primary_key = d2["primary_key"]

        foreign_key, foreign_table, foreign_column = False, None, None
        if (d3 := data_3.get(col_name)) is not None:
            foreign_key, foreign_table, foreign_column = True, d3["foreign_table_name"], d3["foreign_column_name"]

        data_aggregate[col_name] = {
            "data_type": data_1[col_name]["data_type"],
            "default": data_1[col_name]["default"],
            "nullable": data_1[col_name]["nullable"],
            "unique": unique,
            "primary_key": primary_key,
            "foreign_key": foreign_key,
            "foreign_table": foreign_table,
            "foreign_column": foreign_column,
        }

    columns = {}

    for col_name in data_1:
        columns[col_name] = create_column(col_name, data_aggregate[col_name])

    for col_name, col in columns.items():
        col.set_name(col_name)

    return columns
