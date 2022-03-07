from app import Mentor


def get_mentors(mentors, user):
    suitable_mentors = []

    for mentor in mentors:
        if mentor.user.department.id != user.department.id and mentor.user.id != user.id:
            suitable_mentors.append(mentor)


    return suitable_mentors
