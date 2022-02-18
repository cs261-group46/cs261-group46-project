import app.SQL as SQL


def exists(db, subject: str):
    if SQL.is_valid_input(subject):
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM SUBJECTS WHERE subjectName='{subject}';")
        data = cursor.fetchall()
        if len(data) == 0:
            return False
        return True
    else:
        return False


def get_if_exist(db, subject: str):
    if SQL.is_valid_input(subject):
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM SUBJECTS WHERE subjectName='{subject}';")
        data = cursor.fetchall()
        if len(data) == 0:
            return False
        return data[0]
    else:
        return False


def get_all(db):
    statement = f"SELECT * FROM DEPARTMENTS;"
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    r_data = {}
    for row in data:
        r_data[row[0]] = row[1]
    return r_data