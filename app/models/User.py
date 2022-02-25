from email.policy import default
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from app import db
from datetime import datetime


class User(db.Model):
    query: db.Query # Type hint here
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid4)
    email = db.Column(db.String(128), unique=True, nullable=False)
    hashed_password = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(128), nullable=False)
    account_creation_date = db.Column(db.DateTime, default=datetime.now())
    verified = db.Column(db.Boolean, default=False)
    permissions = db.Column(db.Integer, default=0)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.email
