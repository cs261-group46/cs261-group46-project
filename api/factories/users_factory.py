import random
from api.models  import User, Department
from api.utils.strings import generate_random_string
from werkzeug.security import generate_password_hash


def users_factory(departments):

    names = ["Bessie Allan", "Hiba Beck", "Logan Long", "Elowen Page", "Penelope Sims", "Asa Mckenna" "Elaina Buchanan", "Keiren Sawyer", "Rudi Perez", "Yvie Currie", "Collette Ellwood", "Adyan Howell", "Layton Salt", "Ilayda Avalos", "Henley Blair", "Acacia Moyer", "Cally Ford", "Athena Woodward", "Carrie Watkins", "Lily-Mai Carty"]
    users = []

    for i in range(0, 18):
        name = random.choice(names)
        names.remove(name)

        first_name = name.split(" ", 1)[0]
        last_name = name.split(" ", 1)[1]
        email = first_name.lower() + last_name.lower() + "@gmail.com"

        user = User(
            email=email,
            hashed_password=generate_password_hash(password="1234"),
            first_name=first_name,
            last_name=last_name,
            verified=True,
            department_id=random.choice(departments).id
        )
        users.append(user)

    return users
