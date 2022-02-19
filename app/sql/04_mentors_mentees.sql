DROP TABLE MENTORS cascade;
CREATE TABLE MENTORS (
    userID varchar(36),
    aboutMe text,
    score integer,
    -- what for?
    primary key (userID),
    foreign key (userID) references USERS(id)
);

DROP TABLE MENTORS_TOPICS cascade;
CREATE TABLE MENTORS_TOPICS (
    mentorID varchar(36),
    topicID integer,
    priority integer,
    primary key (mentorID, topicID),
    foreign key (mentorID) references MENTORS(userID),
    foreign key (topicID) references TOPICS(id)
);

DROP TABLE MENTEES cascade;
CREATE TABLE MENTEES (
    userID varchar(36),
    mentorID integer,
    aboutMe text,
    weight float,
    primary key (userID),
    foreign key (userID) references USERS(id)
);

DROP TABLE MENTEES_TOPICS cascade;
CREATE TABLE  MENTEES_TOPICS (
    menteeID varchar(36),
    topicID integer,
    priority integer,
    primary key (menteeID, topicID),
    foreign key (menteeID) references MENTEES(userID),
    foreign key (topicID) references TOPICS(id)
);


-- CREATE OR REPLACE VIEW view_MENTORS AS
--     SELECT
--         mo.userID AS userID,
--         mo.aboutMe,
--         us.email,
--         us.firstName,
--         us.lastName,
--         us.accountCreationDate,
--         us.verified,
--         us.department,
--         us.groupID
--     FROM mentors mo JOIN users us ON us.id=mo.userID;
-- --
-- CREATE OR REPLACE VIEW view_MENTOR_TOPICS AS
--     SELECT
--         mo.userID,
--         mo.aboutMe,
--         mt.id AS mentorTopicID,
--         mt.topicID,
--         top.name,
--         us.unique_user_id,
--         us.email,
--         us.firstName,
--         us.lastName,
--         us.accountCreationDate,
--         us.verified,
--         us.currentDepartment,
--         us.groupID
--     FROM mentors mo JOIN users us ON us.id=mo.userID JOIN MENTOR_TOPICS mt ON mt.mentorID=mo.id JOIN topics top ON top.id=mt.topicID;
--
-- CREATE OR REPLACE VIEW view_MENTEES AS
--     SELECT
--         me.id AS menteeID,
--         me.userID,
--         us.unique_user_id,
--         us.email,
--         us.firstName,
--         us.lastName,
--         us.accountCreationDate,
--         us.verified,
--         us.currentDepartment,
--         us.groupID FROM mentees me JOIN users us ON us.id=me.userID;
