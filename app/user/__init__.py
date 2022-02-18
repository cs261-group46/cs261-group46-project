import datetime
import uuid

from app.user.auth import register, login, logout
import app.user.GetUserBy as GetUserBy
import app.SQL as SQL



class User:
    """This is just a data class"""
    def __init__(self):
        self.database_id: int = None
        self.unique_user_id: uuid.UUID = None
        self.email: str = None
        self.first_name: str = None
        self.last_name: str = None
        self.account_creation_date: datetime.datetime = None
        self.verified: bool = None
        self.hashed_password: str = None
        self.salt: str = None
        self.departmentID: int = None
        self.groupID: int = None

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key]=value
        r_dict["uuid"] = self.unique_user_id
        r_dict["first_name"] = self.first_name
        r_dict["last_name"] = self.last_name
        return r_dict

    def __eq__(self, other):
        if isinstance(other, User):
            return self.database_id == other.database_id
        return False

    def __repr__(self):
        return f"User [{self.database_id},{self.email},{self.first_name} {self.last_name}, {self.verified}]"


def does_department_exist(db, department: str):
    if SQL.is_valid_input(department):
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM DEPARTMENTS WHERE departmentName='{department}';")
        data = cursor.fetchall()
        if len(data) == 0:
            return False
        return data[0]
    else:
        return False


def get_all_departments(db):
    statement = f"SELECT * FROM DEPARTMENTS;"
    cursor = db.cursor()
    cursor.execute(statement)
    data = cursor.fetchall()
    r_data = {}
    for row in data:
        r_data[row[0]] = row[1]
    return r_data
