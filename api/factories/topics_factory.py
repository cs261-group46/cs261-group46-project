from api.models import Topic


def topics_factory():
    topic1 = Topic(name="Trading")
    topic2 = Topic(name="Football")
    topic3 = Topic(name="Python")
    topic4 = Topic(name="Coding")
    topic5 = Topic(name="Problem Solving")
    topic6 = Topic(name="JAVA")
    topic7 = Topic(name="Cooking")
    topic8 = Topic(name="Full-Stack")
    topic9 = Topic(name="Entrepreneurship")
    topic10 = Topic(name="Business")
    topic11 = Topic(name="Rugby")
    topic12 = Topic(name="Chess")
    topic13 = Topic(name="Singing")
    topic14 = Topic(name="Tennis")
    return [topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8, topic9, topic10, topic11, topic12, topic13, topic14]
