from email.policy import default
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from app import db
from datetime import datetime
from app.models.BaseModel import BaseModel


# users_topics = db.Table('users_topics',
#                         db.Column('user_id', db.Integer, db.ForeignKey(
#                             'users.id'), primary_key=True),
#                         db.Column('topic_id', db.Integer, db.ForeignKey(
#                             'topics.id'), primary_key=True),
#                         db.Column('priority', db.Integer)
#                         )

class User(BaseModel):
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
    # topics = db.relationship(
    #     'Topic', secondary=users_topics, backref='users', lazy=True)

    department_id = db.Column(db.Integer, db.ForeignKey(
        'departments.id'), nullable=False)

    department = db.relationship('Department', backref="users", lazy=True)

    default_fields = ['email', 'first_name', 'last_name', 'department']
    hidden_fields = ['hashed_password']

    def __repr__(self):
        return f'<User \n Email: {self.email} \n FirstName: {self.first_name} \n LastName: {self.last_name}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
