from app import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True)
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
