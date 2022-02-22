from sqlalchemy.dialects.postgresql import UUID
from app import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    hashed_password = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(128), nullable=False)
    account_creation_date = db.Column(db.DateTime, default=datetime.now())
    verified = db.Column(db.Boolean, default=False)
    expert = db.Column(db.Boolean, default=False)
    permission_level = db.Column(db.Integer, default=0)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)

    tokens = db.relationship("Token", backref="user", lazy=True)

    def __repr__(self):
        return f"{self.__class__.__name__} ({self.id}, {self.email})"

    def get_api_return_data(self, d=None):
        if d is None:
            d = {}
        d["uuid"] = self.unique_user_id
        d["first_name"] = self.firstName
        d["last_name"] = self.lastName
        d["verified"] = self.verified
        d["expert"] = self.expert
        return d
