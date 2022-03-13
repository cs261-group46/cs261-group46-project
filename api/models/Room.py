from api.app import db


class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    def __repr__(self):
        return f'<Room \n Name: {self.name}>'

    def commit(self):
        db.session.add(self)
        db.session.commit()
        return self
