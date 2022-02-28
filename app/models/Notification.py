from sqlalchemy.dialects.postgresql import UUID
from app import db


class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    notification_level = db.Column(db.String(10), db.CheckConstraint("notification_level IN ('warning', 'alert', 'info')"))
    notification_type = db.Column(db.String(10), db.CheckConstraint("notification_type IN ('learning', 'mentoring', 'expertise')"))
    user_id = db.Column(UUID, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    solution = db.Column(db.Text, nullable=True)
    sent = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"{self.__class__.__name__} ({self.id}, {self.notification_level}, {self.notification_type}, {self.user_id}, {self.description})"