CREATE TABLE IF NOT EXISTS MENTORS (
    id serial,
    userID integer,
    about text,
    score real DEFAULT 0, -- what for?
    primary key (id),
    foreign key (userID) references USERS(id)
);

CREATE TABLE IF NOT EXISTS MENTOR_TOPICS (
    id serial,
    mentorID integer,
    topicID integer,
    priority real DEFAULT 0,
    primary key (id),
    foreign key (mentorID) references MENTORS(id),
    foreign key (topicID) references TOPICS(id)
);

CREATE OR REPLACE VIEW view_MENTORS AS
    SELECT
        mo.id AS mentorID,
        mo.userID,
        mo.about,
        us.unique_user_id,
        us.email,
        us.firstName,
        us.lastName,
        us.accountCreationDate,
        us.verified,
        us.departmentID,
        us.groupID
    FROM mentors mo JOIN users us ON us.id=mo.userID;

CREATE OR REPLACE VIEW view_MENTOR_TOPICS_WITH_TOPIC_NAMES AS
    SELECT
        MENTOR_TOPICS.id,
        MENTOR_TOPICS.mentorID,
        MENTOR_TOPICS.priority,
        TOPICS.id as topicID,
        TOPICS.name as topicName
    FROM MENTOR_TOPICS JOIN TOPICS ON TOPICS.id=MENTOR_TOPICS.topicID;

CREATE OR REPLACE VIEW view_MENTOR_TOPICS AS
    SELECT
        men.mentorID,
        men.userID,
        men.about,
        top.id AS mentorTopicID,
        top.topicID,
        top.topicName,
        men.unique_user_id,
        men.email,
        men.firstName,
        men.lastName,
        men.accountCreationDate,
        men.verified,
        men.departmentID,
        men.groupID
    FROM view_MENTORS men LEFT OUTER JOIN view_MENTOR_TOPICS_WITH_TOPIC_NAMES top ON men.mentorID=top.mentorID;