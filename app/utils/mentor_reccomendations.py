from app import Mentor, Topic
import math


def get_mentors(mentors, user):
    suitable_mentors = []

    # todo: consider capacity
    for mentor in mentors:
        if mentor.user.department.id != user.department.id and mentor.user.id != user.id:
            suitable_mentors.append(mentor)

    user_topics = [topic.topic for topic in sorted(user.mentee.topics, key=lambda topic: topic.priority)]


    # print(user.mentee.topics.sort(key=lambda topic: topic.priority))
    # for
    unordered_mentors = []

    for mentor in suitable_mentors:
        mentor_topics = [topic.topic for topic in sorted(mentor.topics, key=lambda topic: topic.priority)]
        value = RBO(mentor_topics, user_topics)
        unordered_mentors.append((mentor, value))

    sorted_mentors = [mentorTuple[0] for mentorTuple in sorted(unordered_mentors, key=lambda tuple: tuple[1], reverse=True)]


    return sorted_mentors


def RBO(list1, list2, p=0.9):
    value = 0

    for d in range(1, min(len(list1), len(list2))+1):
        Xd = overlap(list1, list2, d)
        Ad = Xd/d
        value += (p**(d-1)) * Ad

    value = value * (1-p)
    return value


def overlap(list1, list2, depth):
    S = set(list1[0:depth])
    T = set(list2[0:depth])

    return len(S.intersection(T))
