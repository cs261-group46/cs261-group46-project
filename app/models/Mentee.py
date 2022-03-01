from app import db
from app.models.BaseModel import BaseModel


class Mentee(BaseModel):
    __tablename__ = 'mentees'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    mentor_iD = db.Column(db.Integer, db.ForeignKey(
        'mentors.id'), nullable=False)
    about = db.Column(db.Text, nullable=True)
    weight = db.Column(db.Float, nullable=False)

    user = db.relationship("User", backref=db.backref("mentee", uselist=False))


    def __repr__(self):
        return f"Mentee('')"

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
