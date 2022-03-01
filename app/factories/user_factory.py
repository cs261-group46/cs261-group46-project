from app import db, User, Department
from werkzeug.security import generate_password_hash


def user_factory(departments):

    user1 = User(
        email="test1@gmail.com",
        hashed_password=generate_password_hash(password="1234"),
        first_name="First",
        last_name="User",
        verified=True,
        department_id=departments[0].id
    )

    user2 = User(
        email="test2@gmail.com",
        hashed_password=generate_password_hash(password="1234"),
        first_name="Second",
        last_name="User",
        verified=True,
        department_id=departments[0].id

    )

    user3 = User(
        email="test3@gmail.com",
        hashed_password=generate_password_hash(password="1234"),
        first_name="Third",
        last_name="User",
        verified=True,
        department_id=departments[0].id
    )

    user4 = User(
        email="test4@gmail.com",
        hashed_password=generate_password_hash(password="1234"),
        first_name="Fourth",
        last_name="User",
        verified=True,
        department_id=departments[0].id
    )

    user5 = User(
        email="test5@gmail.com",
        hashed_password=generate_password_hash(password="1234"),
        first_name="Fifth",
        last_name="User",
        verified=True,
        department_id=departments[0].id
    )

    user6 = User(
        email="test6@gmail.com",
        hashed_password=generate_password_hash(password="1234"),
        first_name="Sixth",
        last_name="User",
        verified=True,
        department_id=departments[0].id
    )

    users = [user1, user2, user3, user4, user5, user6]

    return users


# id = db.Column(db.Integer, primary_key=True)
# uuid = db.Column(UUID(as_uuid=True), unique=True,
#                  nullable=False, default=uuid4)
# email = db.Column(db.String(128), unique=True, nullable=False)
# hashed_password = db.Column(db.Text, nullable=False)
# first_name = db.Column(db.String(128), nullable=False)
# last_name = db.Column(db.String(128), nullable=False)
# account_creation_date = db.Column(db.DateTime, default=datetime.now())
# verified = db.Column(db.Boolean, default=False)
# permissions = db.Column(db.Integer, default=0)
# topics = db.relationship(
#     'Topic', secondary=users_topics, backref='users', lazy=True)

# department_id = db.Column(db.Integer, db.ForeignKey(
#     'departments.id'), nullable=False)

# department = db.relationship('Department', backref="users", lazy=True)
