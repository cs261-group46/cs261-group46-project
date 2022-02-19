import datetime
from uuid import UUID
from app.user.auth import register, login, logout
import app.user.GetBy as GetBy
import app.utils as Utils
import app.environ as environ


class User:
    """This is just a data class"""
    def __init__(self,
                 id=None, uuid=None, email=None, first_name=None, last_name=None,
                 account_creation_date=None, verified=None,
                 hashed_password=None, salt=None,
                 departmentID=None, groupID=None):
        if not (isinstance(id, int) and
                isinstance(email, str) and
                isinstance(first_name, str) and
                isinstance(last_name, str) and
                isinstance(account_creation_date, datetime.datetime) and
                isinstance(verified, bool) and
                isinstance(hashed_password, str) and
                isinstance(salt, str) and
                isinstance(departmentID, int) and
                isinstance(groupID, int)):
            raise TypeError()
        self.id: int = id
        if isinstance(uuid, UUID):
            self.uuid: UUID = uuid
        else:
            self.uuid: UUID = UUID(uuid)
        self.email: str = email
        self.first_name: str = first_name
        self.last_name: str = last_name
        self.account_creation_date: datetime.datetime = account_creation_date
        self.verified: bool = verified
        self.hashed_password: str = hashed_password
        self.salt: str = salt
        self.departmentID: int = departmentID
        self.groupID: int = groupID

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key]=value
        r_dict["uuid"] = self.uuid
        r_dict["first_name"] = self.first_name
        r_dict["last_name"] = self.last_name
        return r_dict

    def __eq__(self, other):
        if isinstance(other, User):
            return self.id == other.id
        return False

    def __repr__(self):
        return f"User [{self.id},{self.email},{self.first_name} {self.last_name}, {self.verified}]"

    def isDummy(self):
        return False

    def isLoaded(self):
        return not self.isDummy()

    def send_verify_email(self):
        validation_token = Utils.create_validation_token(environ.get("SECRET_KEY"), self.email)
        MailRegister.VERIFY.send([self.email], )


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
from app import Mail, MailRegister