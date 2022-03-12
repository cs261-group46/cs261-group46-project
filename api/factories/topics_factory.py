from api.models import Topic


def topics_factory():
    topic1 = Topic(name="Trading")
    topic2 = Topic(name="Craftsmanship")
    topic3 = Topic(name="Trampoline")
    topic4 = Topic(name="Skating")
    topic5 = Topic(name="Football")
    topic6 = Topic(name="Folklore")

    return [topic1, topic2, topic3, topic4, topic5, topic6]
