from app import db


class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)
    users = db.relationship('User', backref='department', lazy=True)

    def __repr__(self):
        return '<Department %r>' % self.name
