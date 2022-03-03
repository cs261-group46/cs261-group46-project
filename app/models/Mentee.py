from app import db, ma
from app.models.BaseModel import BaseModel


class Mentee(db.Model):
    __tablename__ = 'mentees'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey(
        'mentors.id'), nullable=False)
    about = db.Column(db.Text, nullable=True)
    weight = db.Column(db.Float, nullable=False, default=0.5)

    user = db.relationship("User", backref=db.backref("mentee", uselist=False))
    mentor = db.relationship("Mentor", backref="mentees", lazy=True)

    hidden_fields = ['weight']
    default_fields = ["user", "mentor", "about"]

    def __repr__(self):
        return f'<Mentee \n User: {self.user} \n Mentor: {self.mentor} \n About: {self.about} \n Weight: {self.weight}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self

# class MenteeSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = Mentee
#
#     id = ma.auto_field()
#     about = ma.auto_field()
#
#     # user
#     # mentor
#     # topics
