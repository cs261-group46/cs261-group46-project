CREATE OR REPLACE FUNCTION add_minutes_to_timestamp(t TIMESTAMP, m INTEGER)
    returns TIMESTAMP
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            ft TIMESTAMP;
        BEGIN
            SELECT t + m * INTERVAL '1 minute' INTO ft;
            RETURN ft;
        END;
    $$;

CREATE OR REPLACE FUNCTION add_minutes_to_timestamp_with_timezone(t TIMESTAMP WITH TIME ZONE, m INTEGER)
    returns TIMESTAMP
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            ft TIMESTAMP;
        BEGIN
            SELECT t + m * INTERVAL '1 minute' INTO ft;
            RETURN ft;
        END;
    $$;


CREATE TABLE IF NOT EXISTS DEPARTMENTS (
    id serial,
    name varchar(128),
    primary key (id)
);


CREATE TABLE IF NOT EXISTS TOPICS (
    id serial,
    name varchar(128),
    primary key (id)
);

CREATE TABLE IF NOT EXISTS EXPERTISES (
    id serial,
    name varchar(128),
    primary key (id)
);