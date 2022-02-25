from app import db


class Topic(db.Model):
    query: db.Query # Type hint here
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    def __repr__(self):
        return '<Topic %r>' % self.name
