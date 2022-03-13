from api.app import db


class PlanOfAction(db.Model):
    __tablename__ = 'plans_of_action'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(10), db.CheckConstraint(
        "status IN ('active', 'completed')"))
    mentee_id = db.Column(db.Integer, db.ForeignKey('mentees.id'), nullable=False)
    title = db.Column(db.String(500), nullable=False)

    mentee = db.relationship("Mentee", backref="plans_of_action", lazy=True)

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self