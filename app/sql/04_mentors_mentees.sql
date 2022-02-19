CREATE TABLE IF NOT EXISTS MENTORS (
    id serial,
    userID integer,
    about text,
    score integer, -- what for?
    primary key (id),
    foreign key (userID) references USERS(id)
);

CREATE TABLE IF NOT EXISTS MENTEES (
    id serial,
    userID integer,
    about text,
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


CREATE TABLE IF NOT EXISTS MENTEE_TOPICS (
    id serial,
    menteeID integer,
    topicID integer,
    priority real DEFAULT 0,
    primary key (id),
    foreign key (menteeID) references MENTEES(id),
    foreign key (topicID) references TOPICS(id)
);

CREATE TABLE IF NOT EXISTS MENTOR_MENTEE_RELATION (
    id serial,
    mentorTopicID integer,
    menteeTopicID integer,
    weight float,
    primary key (id),
    foreign key (mentorTopicID) references MENTOR_TOPICS(id),
    foreign key (menteeTopicID) references MENTEE_TOPICS(id)
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
        mo.id AS mentorID,
        mo.userID,
        mo.about,
        mt.id AS mentorTopicID,
        mt.topicID,
        top.name,
        us.unique_user_id,
        us.email,
        us.firstName,
        us.lastName,
        us.accountCreationDate,
        us.verified,
        us.departmentID,
        us.groupID
    FROM mentors mo JOIN users us ON us.id=mo.userID JOIN MENTOR_TOPICS mt ON mt.mentorID=mo.id JOIN topics top ON top.id=mt.topicID;

CREATE OR REPLACE VIEW view_MENTEES AS
    SELECT
        me.id AS menteeID,
        me.userID,
        us.unique_user_id,
        us.email,
        us.firstName,
        us.lastName,
        us.accountCreationDate,
        us.verified,
        us.departmentID,
        us.groupID
    FROM MENTEES me JOIN users us ON us.id=me.userID;
