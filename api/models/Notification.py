from api.app import db


class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    notification_level = db.Column(db.String(10), db.CheckConstraint(
        "notification_level IN ('warning', 'alert', 'info')"))
    notification_type = db.Column(db.String(10), db.CheckConstraint(
        "notification_type IN ('learning', 'mentoring', 'expertise')"))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)

    user = db.relationship("User", backref="notifications", lazy=True)

    def __repr__(self):
        return f'<Notification \n NotificationLevel: {self.notification_level} \n NotificationType: {self.notification_type} \n User: {self.user} \n Description: {self.description}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self


