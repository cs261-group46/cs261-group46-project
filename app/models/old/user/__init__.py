from flask import url_for
from flask.sessions import SessionMixin

from app.sql import conn, is_valid_input
from app import Mail, MailRegister

from app.models import Token

from app.models.utils import fake_alchemy
from app.models.utils.fake_alchemy import Model, Column, ColumnType, Serial, Text, VarChar, Timestamp, Reference, \
    Boolean, Integer, UUID, ModelGroup
from app.models.utils.model_filters import get_user_filters
from app.utils import ConcurrentContext

from app.models import Department
# from app.models.departments import Department


class User(get_user_filters("id")):
    __tablename__ = "users"

    id = Column(Serial, primary_key=True)
    unique_user_id = Column(UUID, unique=True)
    email = Column(Text, unique=True)
    salt = Column(Text)
    firstName = Column(Text)
    lastName = Column(Text)
    account_creation_date = Column(Timestamp)
    verified = Column(Boolean)
    expert = Column(Boolean)
    hashed_password = Column(Text)
    departmentID = Column(Reference(Department))
    groupID = Column(Integer)

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key] = value
        r_dict["uuid"] = self.unique_user_id
        r_dict["first_name"] = self.firstName
        r_dict["last_name"] = self.lastName
        r_dict["verified"] = self.verified
        r_dict["expert"] = self.expert
        return r_dict

    def send_verify_email(self, db: conn):
        validation_token = Token.generate(db, self, "EMAIL_VERIFY")
        # validation_token = Utils.create_validation_token(environ.get("SECRET_KEY"), self.uuid)
        MailRegister.VERIFY.send([self.email],
                                 user=self,
                                 password_reset_redirect_link="/reset_password",
                                 verify_url=f"/verification/register/{validation_token}")
        print(url_for("verification.verification_register.token", token=validation_token, _external=True))

    def __repr__(self):
        return f"User [{self.id},{self.email},{self.firstName} {self.lastName}, {self.verified}, {self.unique_user_id}]"

    def get_eq(self, arg_name, value) -> str:
        match arg_name:
            case "uuid":
                return super().get_eq("unique_user_id", value)
                # return f"unique_user_id='{value}'"
            case _:
                return super().get_eq(arg_name, value)

    def convert_to_data_type(self, row: list, concurrent_context=None):
        databaseID, uuid, email, hashed_password, salt, first_name, last_name, account_creation_date, verified, expert, departmentID, groupID = row

        kwargs = {
            "id": databaseID, "unique_user_id": uuid, "email": email,
            "hashed_password": hashed_password, "salt": salt,
            "firstName": first_name, "lastName": last_name, "account_creation_date": account_creation_date,
            "verified": verified, "expert": expert,
            "departmentID": departmentID, "groupID": groupID
        }
        if concurrent_context:
            concurrent_context: ConcurrentContext
            concurrent_context.new(User, **kwargs)
        else:
            return User(**kwargs)


query = User()

select = query.select


def session(login_token_key_str, session: SessionMixin) -> ModelGroup:
    if (token := session.get(login_token_key_str)) is not None:
        if is_valid_input(token):
            return query.select(login_token=token)
    return ModelGroup.empty()
