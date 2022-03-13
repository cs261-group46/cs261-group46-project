from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from api.app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), unique=True,
                     nullable=False, default=uuid4)
    email = db.Column(db.String(128), unique=True, nullable=False)
    hashed_password = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(128), nullable=False)
    account_creation_date = db.Column(db.DateTime, default=datetime.now())
    verified = db.Column(db.Boolean, default=False)
    permissions = db.Column(db.Integer, default=0)
    department_id = db.Column(db.Integer, db.ForeignKey(
        'departments.id'), nullable=False)

    department = db.relationship('Department', backref="users", lazy=True)

    def __repr__(self):
        return f'<User \n Email: {self.email} \n FirstName: {self.first_name} \n LastName: {self.last_name}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self


