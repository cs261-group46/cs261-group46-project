from api.app import db


class Mentee(db.Model):
    __tablename__ = 'mentees'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey(
        'mentors.id'), nullable=True)
    about = db.Column(db.Text, nullable=True)
    score = db.Column(db.Float, nullable=False, default=2.5)

    weight = db.Column(db.Float, nullable=False, default=0.5)

    user = db.relationship("User", backref=db.backref("mentee", uselist=False))
    mentor = db.relationship("Mentor", backref="mentees", lazy=True)

    def __repr__(self):
        return f'<Mentee \n User: {self.user} \n Mentor: {self.mentor} \n About: {self.about} \n Weight: {self.weight}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self

