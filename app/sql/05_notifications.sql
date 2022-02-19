CREATE TABLE IF NOT EXISTS NOTIFICATION_TYPE (
    id serial,
    name varchar(128),
    primary key (id)
);

CREATE TABLE IF NOT EXISTS NOTIFICATION_LEVEL (
    id serial,
    name varchar(128),
    primary key (id)
);

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