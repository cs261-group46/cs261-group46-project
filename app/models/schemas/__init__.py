from app import ma, \
    Mentor, Department, User, Topic, MenteeTopic, \
    Notification, MentorTopic, MentorshipRequest, \
    Mentee, Expert


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    email = ma.auto_field()
    first_name = ma.auto_field()
    last_name = ma.auto_field()
    permissions = ma.auto_field()
    department = ma.Nested(lambda: DepartmentSchema(exclude=["users"]))
    mentor = ma.Nested(lambda: MentorSchema(exclude=["user"]))
    mentee = ma.Nested(lambda: MenteeSchema(exclude=["user", "mentor.user"]))
    expert = ma.Nested(lambda: ExpertSchema(exclude=["user", "topics.experts", "topics.mentors", "topics.mentees"]))
    notifications = ma.Nested(lambda: NotificationSchema(exclude=["user"]), many=True)


class MentorSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Mentor

    id = ma.auto_field()
    about = ma.auto_field()
    score = ma.auto_field()
    capacity = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["mentor"]))
    topics = ma.Nested(lambda: MentorTopicSchema(exclude=["mentor", "topic.experts", "topic.mentees", "topic.mentors"]), many=True)
    mentees = ma.Nested(lambda: MenteeSchema(exclude=["mentor", "mentorship_requests_sent"]), many=True)
    mentorship_requests_received = ma.Nested(lambda: MentorshipRequestSchema(exclude=["mentor", "mentee.mentor"]), many=True)


class MenteeSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Mentee

    id = ma.auto_field()
    about = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["mentee", "mentor", "expert", "notifications", "permissions"]))
    mentor = ma.Nested(MentorSchema(exclude=["mentees"]))
    topics = ma.Nested(lambda: MenteeTopicSchema(exclude=["mentee", "topic.experts", "topic.mentees", "topic.mentors"]), many=True)
    mentorship_requests_sent = ma.Nested(lambda: MentorshipRequestSchema(exclude=["mentee", "mentor.mentees"]), many=True)


class ExpertSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Expert

    id = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["expert"]))
    topics = ma.Nested(lambda: TopicSchema(exclude=["experts"]), many=True)


class DepartmentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Department

    id = ma.auto_field()
    name = ma.auto_field()
    users = ma.Nested(UserSchema(exclude=["department"]), many=True)


class TopicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Topic

    id = ma.auto_field()
    name = ma.auto_field()
    mentees = ma.Nested(lambda: MenteeTopicSchema(exclude=["topic"]), many=True)
    mentors = ma.Nested(lambda: MentorTopicSchema(exclude=["topic"]), many=True)
    experts = ma.Nested(ExpertSchema(exclude=["topics"]), many=True)


class MenteeTopicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MenteeTopic

    priority = ma.auto_field()
    mentee = ma.Nested(MenteeSchema(exclude=["topics"]))
    topic = ma.Nested(TopicSchema(exclude=["mentees"]))
    # topic


class NotificationSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Notification

    id = ma.auto_field()
    notification_level = ma.auto_field()
    notification_type = ma.auto_field()
    description = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["notifications"]))


class MentorTopicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MentorTopic

    priority = ma.auto_field()
    topic = ma.Nested(TopicSchema(exclude=["mentors"]))
    mentor = ma.Nested(MentorSchema(exclude=["topics"]))
    # topic
    # mentor


class MentorshipRequestSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MentorshipRequest

    id = ma.auto_field()
    mentee = ma.Nested(MenteeSchema(exclude=["mentorship_requests_sent"]))
    mentor = ma.Nested(MentorSchema(exclude=["mentorship_requests_received"]))
    # user
    # mentor

# Room
# Mentor Feedback
# Meeting Feedback
# Application Feedback