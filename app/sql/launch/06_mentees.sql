CREATE TABLE IF NOT EXISTS MENTEES (
    id serial,
    userID integer,
    about text,
    weight real DEFAULT 0,
    primary key (id),
    foreign key (userID) references USERS(id)
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

CREATE OR REPLACE VIEW view_MENTEES AS
    SELECT
        me.id AS menteeID,
        me.userID,
        me.about,
        us.unique_user_id,
        us.email,
        us.firstName,
        us.lastName,
        us.accountCreationDate,
        us.verified,
        us.departmentID,
        us.groupID
    FROM MENTEES me JOIN USERS us ON us.id=me.userID;

CREATE OR REPLACE VIEW view_MENTEE_TOPICS_WITH_TOPIC_NAMES AS
    SELECT
        MENTEE_TOPICS.id,
        MENTEE_TOPICS.menteeID,
        MENTEE_TOPICS.priority,
        TOPICS.id as topicID,
        TOPICS.name as topicName
    FROM MENTEE_TOPICS JOIN TOPICS ON TOPICS.id=MENTEE_TOPICS.topicID;

CREATE OR REPLACE VIEW view_MENTEE_TOPICS AS
    SELECT
        men.menteeID,
        men.userID,
        men.about,
        top.id AS menteeTopicID,
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
    FROM view_MENTEES men LEFT OUTER JOIN view_MENTEE_TOPICS_WITH_TOPIC_NAMES top ON men.menteeID=top.menteeID;