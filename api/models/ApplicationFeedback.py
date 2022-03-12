from api.app import db

class ApplicationFeedback(db.Model):
    __tablename__ = "application_feedback"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    feedback = db.Column(db.Text, nullable=False)

    user = db.relationship('User', backref="application_feedback", lazy=True)

    def __repr__(self):
        return f'<ApplicationFeedback \n User : {self.user} \n Rating: {self.rating} \n Feedback : {self.feedback}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self


