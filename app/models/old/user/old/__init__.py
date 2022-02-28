from app.models.user.query import UserQuery
from uuid import UUID
from flask import url_for
import datetime
from app.sql import conn
from app.models import Token


class User:
    def __init__(self,
                 id=None, uuid=None, email=None, first_name=None, last_name=None,
                 account_creation_date=None, verified=None, expert=None,
                 hashed_password=None, salt=None,
                 departmentID=None, groupID=None):
        self.id: int = id
        self.uuid: UUID = uuid
        self.email: str = email
        self.first_name: str = first_name
        self.last_name: str = last_name
        self.account_creation_date: datetime.datetime = account_creation_date
        self.verified: bool = verified
        self.expert: bool = expert
        self.hashed_password: str = hashed_password
        self.salt: str = salt
        self.departmentID: int = departmentID
        self.groupID: int = groupID

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key] = value
        r_dict["uuid"] = self.uuid
        r_dict["first_name"] = self.first_name
        r_dict["last_name"] = self.last_name
        r_dict["verified"] = self.verified
        r_dict["expert"] = self.expert
        return r_dict

    def __eq__(self, other):
        if isinstance(other, User):
            return self.id == other.id
        return False

    def __repr__(self):
        return f"User [{self.id},{self.email},{self.first_name} {self.last_name}, {self.verified}, {self.uuid}]"

    def send_verify_email(self, db: conn):
        validation_token = Token.generate(db, self, "EMAIL_VERIFY")
        # validation_token = Utils.create_validation_token(environ.get("SECRET_KEY"), self.uuid)
        MailRegister.VERIFY.send([self.email],
                                 user=self,
                                 password_reset_redirect_link="/reset_password",
                                 verify_url=f"/verification/register/{validation_token}")
        print(url_for("verification.verification_register.token", token=validation_token, _external=True))

    def isDummy(self):
        return True

    def isLoader(self):
        return not self.isDummy()


class DummyUser(User):
    dummyUser = None

    def __new__(cls, *args, **kwargs):
        if DummyUser.dummyUser is None:
            DummyUser.dummyUser = super().__new__(cls)
        return DummyUser.dummyUser

    def isDummy(self):
        return True

    def get_api_return_data(self, start_dict=None):
        if start_dict is None:
            start_dict = {}
        return start_dict


from app import Mail, MailRegister
from app.models.user import query, GetBy