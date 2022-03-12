from api.models import Mentee
import random
from api.utils.strings import generate_random_string



def mentees_factory(users, mentors):
    mentees = []
    users = users.copy()

    for _ in range(0, 10):
        user = random.choice(users)
        users.remove(user)
        mentee = Mentee(
            user_id=user.id,
            mentor_id=random.choice(mentors).id,
            about=generate_random_string(
                30, allowDigits=False, allowPanctuation=False),
        )
        mentees.append(mentee)

    return mentees
