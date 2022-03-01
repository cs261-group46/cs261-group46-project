from app import db
from app.models.BaseModel import BaseModel


class Department(BaseModel):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    default_fields = ['name']


    def __repr__(self):
        return '<Department %r>' % self.name

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
