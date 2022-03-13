from api.app import db
from api.models import Mentor, MentorTopic
import random


def mentors_factory(users, topics):

    abouts = ["I am a teacher and a mentor. I believe that teaching is not just about imparting knowledge to students, but also about guiding them to the right path. My teaching style is very interactive. I believe that all students are different and need to be treated differently. I am very patient with my students and try my best to understand their needs.",
              "I am a mentor who prefers to be a cheerleader for my mentees. I am always there to provide guidance, support and help them in their journey.",
              "I am a mentor who is passionate about helping others and supporting them to live their best life.",
              "My style is to provide all the necessary resources and tools to help my mentees succeed. I am not an approachable person, but I am always available for advice and guidance",
              "I have been mentoring for over 5 years now. I have had many different mentees, but my style has remained the same. I believe that all of my mentees should be given all of the necessary resources and tools in order to succeed in their career. I do not believe in being approachable or accessible, but rather only giving advice when asked for it or when it's necessary.",
              "I have always been a mentor to others. I am a natural born leader and I love to help others reach their goals. I want to be the person that helps you find your strengths and weaknesses, so that you can use them as an asset in your life.",
              "I am not just a mentor but also a friend, who will always be there for you during difficult times. My mentoring style is one of encouragement, support and patience.",
              "I am a mentor who has been mentoring for more than 10 years. I have worked with people from all walks of life.",
              "I believe that mentoring is not just about teaching someone something, but it is also about learning from them. In my time as a mentor, I have learned to be patient and understanding. I have learned to be open-minded and accepting of other people's opinions, beliefs and practices.",
              "I believe in a mentoring style that is based on the mentee's needs. I am not one of those mentors who would just tell you what to do without knowing the context or your goals. I prefer to know what your goals are and then help you achieve them by providing guidance and feedback."]

    mentors = []
    users = users.copy()

    for i in range(0, 100):
        user = random.choice(users)
        users.remove(user)

        mentor = Mentor(
            user_id=user.id,
            about=abouts[i % 10],
            capacity=random.randint(1, 10),
            score=(random.random() * 5)
        )

        mentor_topics = random.sample(topics, random.randint(1, 5))
        for c, t in enumerate(mentor_topics):
            db.session.add(MentorTopic(mentor=mentor, topic=t, priority=c))

        mentors.append(mentor)

    return mentors
