DROP TABLE NOTIFICATION_TYPE cascade;
CREATE TABLE NOTIFICATION_TYPE (
    id serial,
    name varchar(128),
    primary key (id)
);

DROP TABLE NOTIFICATION_LEVEL cascade;
CREATE TABLE IF NOT EXISTS NOTIFICATION_LEVEL (
    id serial,
    name varchar(128),
    primary key (id)
);

DROP TABLE NOTIFICATIONS cascade;
CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
    id serial,
    notificationTypeID integer,
    notificationLevelID integer,
    userID varchar(36),
    description text,
    solution text,
    emailed boolean,
    primary key (id),
    foreign key (notificationTypeID) references NOTIFICATION_TYPE(id),
    foreign key (notificationLevelID) references NOTIFICATION_LEVEL(id),
    foreign key (userID) references USERS(id)
);