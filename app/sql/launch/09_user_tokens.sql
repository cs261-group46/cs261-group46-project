CREATE TABLE IF NOT EXISTS TOKEN_TYPES (
    id serial,
    name text,
    timeoutTime integer,
    refreshOnAccess boolean,
    singleUse boolean,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS USER_TOKENS (
    id serial,
    userID integer,
    tokenValue varchar(128),
    tokenType integer,
    creationTimestamp timestamp default current_timestamp(0),
    timeoutTimestamp  timestamp default NULL,
    primary key (id),
    foreign key (userID) references USERS(id) ON DELETE CASCADE,
    foreign key (tokenType) references TOKEN_TYPES(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION assignTimeoutTimetstamp()
    returns TRIGGER
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            tokenTimeoutTime integer;
        BEGIN
            IF new.timeoutTimestamp IS NULL THEN
                SELECT timeoutTime FROM TOKEN_TYPES WHERE id=new.tokenType INTO tokenTimeoutTime;
                new.timeoutTimestamp = add_minutes_to_timestamp_with_timezone(current_timestamp(0), tokenTimeoutTime);
            END IF;
            RETURN new;
        END;
    $$;

DROP TRIGGER IF EXISTS assignTimeoutTimetstamp ON USER_TOKENS;

CREATE TRIGGER assignTimeoutTimetstamp
    BEFORE INSERT ON USER_TOKENS
    FOR EACH ROW EXECUTE PROCEDURE assignTimeoutTimetstamp();

CREATE OR REPLACE FUNCTION get_user_id_from_token(token_value varchar(128), token_type integer)
    returns integer
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            token_id integer;
            user_id integer;
            token_timeout timestamp;
            token_type_timeout_delay integer;
            token_type_access_refresh boolean;
            token_type_single_use boolean;
        BEGIN
            SELECT timeoutTime, refreshOnAccess, singleUse FROM TOKEN_TYPES WHERE id=token_type INTO token_type_timeout_delay, token_type_access_refresh, token_type_single_use;

            SELECT id, userID, timeoutTimestamp FROM USER_TOKENS WHERE tokenValue=token_value AND tokenType=token_type LIMIT 1 INTO token_id, user_id, token_timeout;

            IF found THEN
                IF token_timeout < current_timestamp(0) THEN
                    DELETE FROM USER_TOKENS WHERE tokenValue=token_value;
                    SELECT NULL INTO user_id;
                ELSE
                    IF token_type_access_refresh IS true THEN
                        UPDATE USER_TOKENS
                            SET timeoutTimestamp=add_minutes_to_timestamp_with_timezone(current_timestamp(0), token_type_timeout_delay)
                            WHERE id=token_id;
                    END IF;
                    IF token_type_single_use IS true THEN
                        DELETE FROM USER_TOKENS WHERE id=token_id;
                    END IF;
                END IF;
            END IF;
            RETURN user_id;
        END;
    $$;

CREATE OR REPLACE FUNCTION get_user_id_from_token(token varchar(128), token_type text)
    returns integer
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            tokenTypeID integer;
        BEGIN
            SELECT id FROM TOKEN_TYPES WHERE name=token_type INTO tokenTypeID;
            RETURN get_user_id_from_token(token, tokenTypeID);
        END;
    $$;

CREATE OR REPLACE FUNCTION register_token(user_id integer, token_value varchar(128), token_type integer)
    RETURNS boolean
    LANGUAGE plpgsql
    AS
    $$
        BEGIN
            INSERT INTO USER_TOKENS(userID, tokenValue, tokenType) VALUES (user_id, token_value, token_type);
            RETURN true;
        END;
    $$;

CREATE OR REPLACE FUNCTION register_token(user_id integer, token_value varchar(128), token_type text)
    RETURNS boolean
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            tokenTypeID integer;
        BEGIN
            SELECT id FROM TOKEN_TYPES WHERE name=token_type INTO tokenTypeID;
            RETURN register_token(user_id, token_value, tokenTypeID);
        END;
    $$;



DELETE FROM USER_TOKENS WHERE timeoutTimestamp < current_timestamp(0);