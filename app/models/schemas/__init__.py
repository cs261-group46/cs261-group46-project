from app import ma, \
    Mentor, Department, User, Topic, MenteeTopic, \
    Notification, MentorTopic, MentorshipRequest, \
    Mentee, Expert, Meeting, Room, MentorFeedback, MenteeFeedback, MeetingFeedback


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
    mentee = ma.Nested(lambda: MenteeSchema(exclude=["user"]))
    expert = ma.Nested(lambda: ExpertSchema(exclude=["user", "topics.experts", "topics.mentors", "topics.mentees"]))
    notifications = ma.Nested(lambda: NotificationSchema(exclude=["user"]), many=True)
    meetings_hosted = ma.Nested(lambda: MeetingSchema(exclude=["host"]), many=True)
    meetings = ma.Nested(lambda: MeetingSchema(exclude=["attendees"]), many=True)
    meeting_feedback = ma.Nested(lambda: MeetingFeedbackSchema(exclude=["user"]), many=True)


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
    received_feedback = ma.Nested(lambda: MentorFeedbackSchema(exclude=["mentor"]), many=True)
    feedback_given = ma.Nested(lambda: MenteeFeedbackSchema(exclude=["feedback_given"]), many=True)


class MenteeSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Mentee

    id = ma.auto_field()
    about = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["mentee", "mentor", "expert", "notifications", "permissions"]))
    mentor = ma.Nested(MentorSchema(exclude=["mentees", "mentorship_requests_received", "user.notifications", "user.permissions", "user.expert", "user.mentor", "user.mentee"]))
    topics = ma.Nested(lambda: MenteeTopicSchema(exclude=["mentee", "topic.experts", "topic.mentees", "topic.mentors"]), many=True)
    mentorship_requests_sent = ma.Nested(lambda: MentorshipRequestSchema(exclude=["mentee", "mentor.mentees"]), many=True)
    feedback_given = ma.Nested(lambda: MenteeFeedbackSchema(exclude=["mentee"]), many=True)
    received_feedback = ma.Nested(lambda: MentorFeedbackSchema(exclude=["mentee"]), many=True)


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
    meetings = ma.Nested(lambda: MeetingSchema(exclude=["topics"]), many=True)


class MenteeTopicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MenteeTopic

    priority = ma.auto_field()
    mentee = ma.Nested(MenteeSchema(exclude=["topics"]))
    topic = ma.Nested(TopicSchema(exclude=["mentees"]))


class RoomSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Room

    id = ma.auto_field()
    name = ma.auto_field()
    meetings = ma.Nested(lambda: MeetingSchema(exclude=["room"]))


class MeetingSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Meeting

    id = ma.auto_field()
    title = ma.auto_field()
    date = ma.auto_field()
    link = ma.auto_field()
    meeting_type = ma.auto_field()
    duration = ma.auto_field()
    capacity = ma.auto_field()
    host = ma.Nested(UserSchema(exclude=["meetings_hosted"]))
    attendees = ma.Nested(UserSchema(exclude=["meetings"]), many=True)
    topics = ma.Nested(TopicSchema(exclude=["meetings"]), many=True)
    room = ma.Nested(RoomSchema(exclude=["meetings"]), many=True)
    feedback = ma.Nested(lambda: MeetingFeedbackSchema(exclude=["meeting"]))


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


class MentorshipRequestSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MentorshipRequest

    id = ma.auto_field()
    mentee = ma.Nested(MenteeSchema(exclude=["mentorship_requests_sent"]))
    mentor = ma.Nested(MentorSchema(exclude=["mentorship_requests_received"]))


class MentorFeedbackSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MentorFeedback

    score = ma.auto_field()
    feedback = ma.auto_field()
    mentee = ma.Nested(MenteeSchema(exclude=["feedback_given"]))
    mentor = ma.Nested(MentorSchema(exclude=["received_feedback"]))


class MenteeFeedbackSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MenteeFeedback

    score = ma.auto_field()
    feedback = ma.auto_field()
    mentee = ma.Nested(MenteeSchema(exclude=["received_feedback"]))
    mentor = ma.Nested(MentorSchema(exclude=["feedback_given"]))


class MeetingFeedbackSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MeetingFeedback

    feedback = ma.auto_field()
    user = ma.Nested(UserSchema(exclude=["meeting_feedback"]))
    meeting = ma.Nested(MeetingSchema(exclude=["feedback"]))


# Application Feedback