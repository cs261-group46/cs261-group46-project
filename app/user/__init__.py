import datetime
import uuid

from app.user.auth import register, login, logout
import app.user.GetBy as GetUserBy
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

    def isDummy(self):
        return False

    def isLoaded(self):
        return not self.isDummy()


class DummyUser(User):
    dummyUser = None

    def __new__(cls, *args, **kwargs):
        if DummyUser.dummyUser is None:
            DummyUser.dummyUser = super().__new__(cls)
        return DummyUser.dummyUser

    def isDummy(self):
        return True

import app.user.mentor as Mentors
import app.user.mentee as Mentees