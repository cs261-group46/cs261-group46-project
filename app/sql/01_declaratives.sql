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


DROP TABLE DEPARTMENTS cascade;
CREATE TABLE DEPARTMENTS (
    id serial,
    name varchar(128),
    primary key (id)
);

DROP TABLE TOPICS cascade;
CREATE TABLE TOPICS (
    id serial,
    name varchar(128),
    primary key (id)
);