from app import db


class Topic(db.Model):
    __tablename__ = "topics"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)
    # users = db.relationship("User", backref="department", lazy=True)

    def __repr__(self):
        return f"{self.__name__} ({self.id}, {self.name})"
