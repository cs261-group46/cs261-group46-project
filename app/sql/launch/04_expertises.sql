CREATE TABLE IF NOT EXISTS EXPERTISES (
    id serial,
    userID integer,
    topicID integer,
    primary key (id),
    foreign key (userID) references USERS(id),
    foreign key (topicID) references TOPICS(id)
);