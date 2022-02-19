from app.models.departments import Department
import app.SQL as SQL


def name(db: SQL.conn, department_name: str):
    if SQL.is_valid_input(department_name):
        department = sql_statement(db, f"SELECT * FROM DEPARTMENTS WHERE name='{department_name}';")
        if department is not None:
            return department[0]
    return None

def databaseID(db: SQL.conn, department_id: int):
    if SQL.is_valid_input(department_id):
        department = sql_statement(db, f"SELECT * FROM DEPARTMENTS WHERE id={department_id};")
        if department is not None:
            return department[0]
    return None

def exists(db: SQL.conn, department):
    if isinstance(department, str):
        return nameExists(db, department)
    elif isinstance(department, int):
        return idExists(db, department)
    else:
        raise Exception("Invalid data type")

def nameExists(db: SQL.conn, department_name: str):
    if (d := name(db, department_name)) is None:
        return False, None
    return True, d

def idExists(db: SQL.conn, department_id: int):
    if (d := databaseID(db, department_id)) is None:
        return False, None
    return True, d


def startswith(db: SQL.conn, start:str):
    if SQL.is_valid_input(start):
        departments = sql_statement(db, f"SELECT * FROM DEPARTMENTS WHERE name LIKE '{start}%';")
        if departments is not None:
            return departments
    return []


def all(db):
    departments = sql_statement(db, f"SELECT * FROM DEPARTMENTS;")
    if departments is not None:
        return departments
    return []


def sql_statement(db: SQL.conn, statement):
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    if len(data) == 0:
        return None
    departments = []

    for row in data:
        departments.append(Department(id=row[0], name=row[1]))

    return departments
