from uuid import UUID
from app.sql import conn
from app.utils import random_string
# import app.models.user
# from app.models import User


class Token:
    def __init__(self, userID=None, tokenValue=None, tokenType=None):
        self.userID: UUID = userID
        self.tokenValue: str = tokenValue
        self.tokenType = tokenType

    def __repr__(self):
        return f"Token({self.userID}, {self.tokenValue}, {self.tokenType})"

    def save(self, db: conn):
        cursor = db.cursor()
        if isinstance(self.tokenType, str):
            cursor.execute(f"SELECT register_token({self.userID}, '{self.tokenValue}', '{self.tokenType}');")
        elif isinstance(self.tokenType, str):
            cursor.execute(f"SELECT register_token({self.userID}, '{self.tokenValue}', {self.tokenType});")
        else:
            raise Exception("Invalid token type")

    def delete(self, db: conn):
        cursor = db.cursor()
        cursor.execute(f"DELETE FROM USER_TOKENS WHERE tokenValue='{self.tokenValue}';")

    @staticmethod
    def generate(db: conn, user, token_type) -> str:
        token_value = get_available_token(db)
        Token(userID=user.id, tokenValue=token_value, tokenType=token_type).save(db)
        return token_value


def get_available_token(db):
    while True:
        token = random_string(128)
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM USER_TOKENS WHERE tokenValue='{token}';")
        data = cursor.fetchall()
        if data is None or len(data) == 0:
            break
    return token
