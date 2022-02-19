CREATE TABLE IF NOT EXISTS USER_LOGIN_TOKENS (
    id serial,
    userID integer,
    token varchar(128),
    loginDate timestamp default current_timestamp(0),
    loginTimeout timestamp default add_minutes_to_timestamp_with_timezone(current_timestamp(0), 60),
    primary key (id),
    foreign key (userID) references USERS(id)
);

CREATE OR REPLACE FUNCTION get_user_id_from_token(login_token varchar(128))
    returns integer
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            user_id integer;
            token_timeout timestamp;
        BEGIN
            SELECT userID FROM USER_LOGIN_TOKENS WHERE loginToken=login_token LIMIT 1 INTO user_id;

            IF found then
                SELECT loginTimeout FROM USER_LOGIN_TOKENS WHERE loginToken=login_token LIMIT 1 INTO token_timeout;

                IF token_timeout < current_timestamp(0) THEN
                    DELETE FROM USER_LOGIN_TOKENS WHERE loginToken=login_token;
                    SELECT NULL INTO user_id;
                ELSE
                    UPDATE USER_LOGIN_TOKENS SET loginTimeout=add_minutes_to_timestamp_with_timezone(current_timestamp(0), 60) WHERE userID=user_id;
                END IF;

            end if;
            RETURN user_id;
        END;
    $$;

DELETE FROM USER_LOGIN_TOKENS WHERE loginTimeout < current_timestamp(0);