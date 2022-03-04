from app import db, ma
from app.models.BaseModel import BaseModel


class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    def __repr__(self):
        return f'<Topic \n Name: {self.name}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self