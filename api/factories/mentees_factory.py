from api.app import db
from api.models import Mentee, MenteeTopic
import random
from api.utils.strings import generate_random_string



def mentees_factory(users, mentors, topics):

    abouts = ["I am a visual learner. I would rather see a video than read instructions. I think that in this day and age, it is important to be open to new ways of learning. It is important not to have just one way of learning but to have different ways of learning.",
              "I learn best when I can see the big picture. I like to be able to look at a problem from different angles, and then find the one that is most effective for me. This helps me understand what I am trying to learn and makes it easier for me to remember it.",
              "I am a visual learner, so I need to have pictures or diagrams in order for me to understand concepts better. When I read, I need time to think about what I just read - it’s not enough just reading through something quickly and understanding it all.",
              "Hi, my name is Tom and I am a visual learner. I like to see the big picture and figure out how everything is connected.",
              "I am a visual learner. I like to see the steps and know what I need to do.",
              "I am a hands-on learner. I like to do the work and learn by doing, not just by reading about it.",
              "I am also a kinesthetic learner, meaning that I learn best by doing. This is why when I do my homework, I often have to get up and walk around or do something else that gets my hands involved in order to really understand what is going on.",
              "I am an auditory learner and I learn better when I can hear the material.",
              "I am a visual learner so I like to see what I'm learning about. I also learn by doing, so I like to try new things and experiment.",
              "I am an auditory learner, so I learn best when I can hear the information spoken aloud."]
    mentees = []
    users = users.copy()

    for i in range(0, 10):
        user = random.choice(users)
        users.remove(user)

        mentee = Mentee(
            user_id=user.id,
            mentor_id=random.choice(mentors).id,
            about=abouts[i],
        )

        mentee_topics = random.sample(topics, random.randint(1, 5))
        for c, t in enumerate(mentee_topics):
            db.session.add(MenteeTopic(mentee=mentee, topic=t, priority=c))

        mentees.append(mentee)

    return mentees
