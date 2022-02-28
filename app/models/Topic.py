from app import db
from app.models.BaseModel import BaseModel


class Topic(BaseModel):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    _default_fields = [
        "id",
        "name",
    ]

    def __repr__(self):
        return '<Topic %r>' % self.name

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
