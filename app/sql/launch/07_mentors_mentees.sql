CREATE TABLE IF NOT EXISTS MENTOR_MENTEE_RELATION (
    id serial,
    mentorTopicID integer,
    menteeTopicID integer,
    weight real,
    primary key (id),
    foreign key (mentorTopicID) references MENTOR_TOPICS(id),
    foreign key (menteeTopicID) references MENTEE_TOPICS(id)
);
