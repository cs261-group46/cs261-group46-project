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
    userID integer,
    description text,
    solution text,
    emailed boolean,
    primary key (id),
    foreign key (notificationTypeID) references NOTIFICATION_TYPE(id),
    foreign key (notificationLevelID) references NOTIFICATION_LEVEL(id),
    foreign key (userID) references USERS(id)
);

CREATE OR REPLACE VIEW view_NOTIFICATIONS AS
    SELECT
        NOTIFICATIONS.id,
        NOTIFICATIONS.notificationTypeID,
        NOTIFICATION_TYPE.name AS notificationTypeName,
        NOTIFICATIONS.notificationLevelID,
        NOTIFICATION_LEVEL.name AS notificationLevelName,
        NOTIFICATIONS.userID,
        NOTIFICATIONS.description,
        NOTIFICATIONS.solution,
        NOTIFICATIONS.emailed
    FROM
        NOTIFICATIONS
        JOIN NOTIFICATION_TYPE  ON NOTIFICATION_TYPE.id  = NOTIFICATIONS.notificationTypeID
        JOIN NOTIFICATION_LEVEL ON NOTIFICATION_LEVEL.id = NOTIFICATIONS.notificationLevelID;