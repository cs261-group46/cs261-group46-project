from app import db
from app.models.BaseModel import BaseModel


class Notification(BaseModel):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    notification_level = db.Column(db.String(10), db.CheckConstraint(
        "notification_level IN ('warning', 'alert', 'info')"))
    notification_type = db.Column(db.String(10), db.CheckConstraint(
        "notification_type IN ('learning', 'mentoring', 'expertise')"))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    description = db.Column(db.Text, nullable=True)
    solution = db.Column(db.Text, nullable=True)
    sent = db.Column(db.Boolean, default=False)

    user = db.relationship("User", backref="notifications", lazy=True)

    def __repr__(self):
        return f"Notification('')"

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
