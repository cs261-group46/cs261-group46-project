import random
from api.models  import User, Department
from api.utils.strings import generate_random_string
from werkzeug.security import generate_password_hash


def users_factory(departments):

    users = []

    for i in range(1, 20):
        user = User(
            email=f'test{i}@gmail.com',
            hashed_password=generate_password_hash(password="1234"),
            first_name=generate_random_string(
                10, allowPanctuation=False, allowDigits=False),
            last_name=generate_random_string(
                10, allowPanctuation=False, allowDigits=False),
            verified=True,
            department_id=random.choice(departments).id
        )
        users.append(user)

    return users
