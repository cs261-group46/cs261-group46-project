def get_mentors(mentors, user):
    suitable_mentors = []

    for mentor in mentors:
        if mentor.user.department.id != user.department.id and mentor.user.id != user.id and len(mentor.mentees) < mentor.capacity:
            suitable_mentors.append(mentor)

    user_topics = [topic.topic.id for topic in sorted(user.mentee.topics, key=lambda topic: topic.priority)]

    unordered_mentors = []

    for mentor in suitable_mentors:
        mentor_topics = [topic.topic.id for topic in sorted(mentor.topics, key=lambda topic: topic.priority)]
        value = RBO(mentor_topics, user_topics)
        unordered_mentors.append((mentor, value + ((mentor.score - 2.5)/10)))

    sorted_mentors = [mentorTuple[0] for mentorTuple in sorted(unordered_mentors, key=lambda tuple: tuple[1], reverse=True)]

    return sorted_mentors[0:21]


def RBO(list1, list2, p=0.9):
    value = 0

    shorter, longer = (list1.copy(), list2.copy()) if len(list1) < len(list2) else (list2.copy(), list1.copy())
    for _ in range(0, len(longer) - len(shorter)):
        shorter.append(-1)

    for d in range(1, len(shorter)+1):
        Xd = overlap(shorter, longer, d)
        Ad = Xd/d
        value += (p**(d-1)) * Ad

    value = value * (1-p)
    return value


def overlap(list1, list2, depth):
    S = set(list1[0:depth])
    T = set(list2[0:depth])

    return len(S.intersection(T))
