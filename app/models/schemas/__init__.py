from app import ma, \
    Mentor, Department, User, Topic, UserTopic, \
    Notification, MentorTopic, MentorshipRequest, \
    Mentee, Expert


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        include_relationships = True

    id = ma.auto_field()
    email = ma.auto_field()
    first_name = ma.auto_field()
    last_name = ma.auto_field()
    permissions = ma.auto_field()
    department = ma.Nested(lambda: DepartmentSchema(exclude=["users"]))
    mentor = ma.Nested(lambda: MentorSchema(exclude=["user"]))
    mentee = ma.Nested(lambda: MenteeSchema(exclude=["user"]))
    expert = ma.Nested(lambda: ExpertSchema(exclude=["user"]))
    topics = ma.Nested(lambda: UserTopicSchema(exclude=["user"]), many=True)
    notifications = ma.Nested(lambda: NotificationSchema(exclude=["user"]), many=True)
    mentorship_requests_sent = ma.Nested(lambda: MentorshipRequestSchema(exclude=["user"]), many=True)


class MentorSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Mentor

    id = ma.auto_field()
    about = ma.auto_field()
    score = ma.auto_field()
    capacity = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["mentor"]))
    topics = ma.Nested(lambda: MentorTopicSchema(exclude=["mentor", "topic.experts", "topic.users"]), many=True)
    mentees = ma.Nested(lambda: MenteeSchema(exclude=["mentor"]), many=True)
    mentorship_requests_received = ma.Nested(lambda: MentorshipRequestSchema(exclude=["mentor"]), many=True)


class MenteeSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Mentee

    id = ma.auto_field()
    about = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["mentee"]))
    mentor = ma.Nested(MentorSchema(exclude=["mentees"]))


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
    users = ma.Nested(lambda: UserTopicSchema(exclude=["topic"]), many=True)
    mentors = ma.Nested(lambda: MentorTopicSchema(exclude=["topic"]), many=True)
    experts = ma.Nested(ExpertSchema(exclude=["topics"]), many=True)


class UserTopicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = UserTopic

    priority = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["topics"]))
    topic = ma.Nested(TopicSchema(exclude=["users"]))
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

    user = ma.Nested(UserSchema(exclude=["mentorship_requests_sent"]))
    mentor = ma.Nested(MentorSchema(exclude=["mentorship_requests_received"]))
    # user
    # mentor

# Room
# Mentor Feedback
# Meeting Feedback
# Application Feedback