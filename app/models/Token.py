from sqlalchemy.dialects.postgresql import UUID
from app import db
from datetime import datetime, timedelta


class TokenType:
    token_types_id = {}
    token_types_name = {}

    def __init__(self, name=None, timeout_time=5, refresh_on_access=False, single_use=False):
        self.id = len(TokenType.token_types_id)
        self.name = name
        TokenType.token_types_id[self.id] = self
        TokenType.token_types_name[self.name] = self

        self.timeout_time = timeout_time
        self.refresh_on_access = refresh_on_access
        self.single_use = single_use

    def get_timeout(self):
        return datetime.utcnow()+timedelta(minutes=self.timeout_time)


LOGIN = TokenType(name="LOGIN", timeout_time=60, refresh_on_access=True, single_use=False)
PASSWORD_RESET = TokenType(name="PASSWORD_RESET", timeout_time=5, refresh_on_access=False, single_use=False)
EMAIL_VERIFY = TokenType(name="EMAIL_VERIFY", timeout_time=15, refresh_on_access=False, single_use=True)

# class TokenType(db.Model):
#     __tablename__ = 'token_types'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.Text, nullable=False, unique=True)
#     timeout_time = db.Column(db.Integer, nullable=False)
#     refresh_on_access = db.Column(db.Boolean, nullable=False)
#     single_use = db.Column(db.Boolean, nullable=False)
#
#     tokens = db.relationshup("Token", backref="tokentype", lazy=True)
#
#     def __repr__(self):
#         return f"{self.__name__} ({self.id}, {self.notification_level}, {self.notification_type}, {self.user_id}, {self.description})"


class Token(db.Model):
    __tablename__ = 'tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    value = db.Column(db.Text, nullable=False)
    # type = db.Column(db.Integer, db.ForeignKey('token_types.id'), nullable=False)
    type = db.Column(db.Integer, nullable=False)
    creation_timestamp = db.Column(db.DateTime, default=datetime.now())
    timeout_timestamp = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"{self.__name__} ({self.id}, {self.notification_level}, {self.notification_type}, {self.user_id}, {self.description})"

