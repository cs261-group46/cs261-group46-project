CREATE OR REPLACE FUNCTION f_delfunc(_name text)
    RETURNS integer
    LANGUAGE plpgsql AS
    $$
        -- drop all functions with given _name in the current search_path, regardless of function parameters
        DECLARE
            functions_dropped integer;
            _sql text;
        BEGIN
            SELECT count(*)::int, 'DROP FUNCTION ' || string_agg(oid::regprocedure::text, '; DROP FUNCTION ')
            FROM   pg_catalog.pg_proc
            WHERE  proname = _name
            AND    pg_function_is_visible(oid)  -- restrict to current search_path
            INTO   functions_dropped, _sql;     -- count only returned if subsequent DROPs succeed
            IF functions_dropped > 0 THEN       -- only if function(s) found
             EXECUTE _sql;
           END IF;
           RETURN functions_dropped;
        END;
    $$;

--DROP PROCEDURE IF EXISTS register_token;
--DROP PROCEDURE IF EXISTS register_token;
SELECT f_delfunc('register_token');
SELECT f_delfunc('get_user_id_from_token');
--DROP FUNCTION get_user_id_from_token;
--DROP FUNCTION get_user_id_from_token;
--DROP FUNCTION get_user_id_from_token;

DROP TRIGGER IF EXISTS assignTimeoutTimetstamp ON USER_TOKENS;
DROP FUNCTION IF EXISTS assignTimeoutTimetstamp;
DROP TABLE IF EXISTS USER_TOKENS;
DROP TABLE IF EXISTS TOKEN_TYPES;
DROP TABLE IF EXISTS USER_LOGIN_TOKENS;

DROP VIEW IF EXISTS view_NOTIFICATIONS;
DROP TABLE IF EXISTS NOTIFICATIONS;
DROP TABLE IF EXISTS NOTIFICATION_LEVEL;
DROP TABLE IF EXISTS NOTIFICATION_TYPE;

DROP TABLE IF EXISTS MENTOR_MENTEE_RELATION;

DROP VIEW IF EXISTS view_MENTEE_TOPICS;
DROP VIEW IF EXISTS view_MENTEE_TOPICS_WITH_TOPIC_NAMES;
DROP VIEW IF EXISTS view_MENTEES;
DROP TABLE IF EXISTS MENTEE_TOPICS;
DROP TABLE IF EXISTS MENTEES;

DROP VIEW IF EXISTS view_MENTOR_TOPICS;
DROP VIEW IF EXISTS view_MENTOR_TOPICS_WITH_TOPIC_NAMES;
DROP VIEW IF EXISTS view_MENTORS;
DROP TABLE IF EXISTS MENTOR_TOPICS;
DROP TABLE IF EXISTS MENTORS;

DROP TABLE IF EXISTS EXPERTISES;

DROP FUNCTION IF EXISTS hasPermission;
DROP TABLE IF EXISTS USERS;

DROP VIEW IF EXISTS view_ApplyingGroupPermissions;
DROP VIEW IF EXISTS view_GroupPermissions;
DROP VIEW IF EXISTS view_InheritedGroups;
DROP TABLE IF EXISTS PERMISSION_GROUP_INHERITANCES;
DROP TABLE IF EXISTS PERMISSION_GROUP_PERMISSIONS;
DROP TABLE IF EXISTS PERMISSION_GROUPS;

DROP TABLE IF EXISTS TOPICS;
DROP TABLE IF EXISTS DEPARTMENTS;
DROP FUNCTION IF EXISTS add_minutes_to_timestamp_with_timezone;
DROP FUNCTION IF EXISTS add_minutes_to_timestamp;

DROP FUNCTION f_delfunc;