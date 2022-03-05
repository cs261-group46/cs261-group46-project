from app import db


class MentorshipRequest(db.Model):
    __tablename__ = "mentorship_requests"

    id = db.Column(db.Integer, primary_key=True)
    mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), nullable=False)
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentors.id'), nullable=False)

    mentor = db.relationship("Mentor", backref="mentorship_requests_received", lazy=True)
    mentee = db.relationship("Mentee", backref="mentorship_requests_sent", lazy=True)

    def __repr__(self):
        return f'<MentorshipRequest \n Mentor: {self.mentor} \n User: {self.user}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self


