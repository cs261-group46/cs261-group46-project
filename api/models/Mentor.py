from api.app import db


class Mentor(db.Model):
    __tablename__ = 'mentors'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    about = db.Column(db.Text, nullable=True)
    score = db.Column(db.Float, nullable=False, default=2.5)
    capacity = db.Column(db.Integer, nullable=False, default=5)

    user = db.relationship("User", backref=db.backref("mentor", uselist=False))

    def __repr__(self):
        return f'<Mentor \n User: {self.user} \n About: {self.about} \n Score: {self.score} \n Topics : {self.topics}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self

