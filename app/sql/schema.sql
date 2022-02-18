CREATE TABLE IF NOT EXISTS DEPARTMENTS (
    departmentID serial,
    departmentName varchar(128),
    primary key (departmentID)
);

CREATE TABLE IF NOT EXISTS NOTIFICATION_TYPE (
    notificationTypeID serial,
    notificationTypeName varchar(128),
    primary key (notificationTypeID)
);

CREATE TABLE IF NOT EXISTS SUBJECTS (
    subjectID serial,
    subjectName varchar(128),
    primary key (subjectID)
);

CREATE TABLE IF NOT EXISTS PERMISSION_GROUPS (
    groupID serial,
    groupName varchar(32),
    primary key (groupID)
);

CREATE TABLE IF NOT EXISTS PERMISSION_GROUP_PERMISSIONS (
    groupID serial,
    groupPermission text,
    permissionValue bool,
    primary key (groupID, groupPermission),
    foreign key (groupID) references PERMISSION_GROUPS(groupID)
);

CREATE TABLE IF NOT EXISTS PERMISSION_GROUP_INHERITANCES (
    groupID serial,
    inheritedGroupID integer,
    primary key (groupID, inheritedGroupID),
    foreign key (groupID) references PERMISSION_GROUPS(groupID),
    foreign key (inheritedGroupID) references PERMISSION_GROUPS(groupID)
);

CREATE TABLE IF NOT EXISTS USERS (
    userID serial,
    unique_user_id varchar(36),
    email varchar(128),
    hashedPassword text,
    salt varchar(16),
    firstName varchar(128),
    lastName varchar(128),
    accountCreationDate timestamp default current_timestamp(0),
    verified bool default false,
    currentDepartment integer,
    groupID integer,
    primary key (userID),
    foreign key (currentDepartment) references DEPARTMENTS(departmentID),
    foreign key (groupID) references PERMISSION_GROUPS(groupID)
);

CREATE TABLE IF NOT EXISTS MENTORS (
    mentorID serial,
    userID integer,
    subjectID integer,
    primary key (mentorID),
    foreign key (userID) references USERS(userID),
    foreign key (subjectID) references SUBJECTS(subjectID)
);

CREATE OR REPLACE VIEW view_MENTORS AS SELECT me.mentorID, me.userID, me.subjectID, us.unique_user_id, us.email, us.firstName, us.lastName, us.accountCreationDate, us.verified, us.currentDepartment, us.groupID FROM mentors me JOIN users us ON us.userID=me.userID;

CREATE TABLE IF NOT EXISTS MENTEES (
    menteeID serial,
    userID integer,
    subjectID integer,
    primary key (menteeID),
    foreign key (userID) references USERS(userID),
    foreign key (subjectID) references SUBJECTS(subjectID)
);

CREATE OR REPLACE VIEW view_MENTEES AS SELECT me.menteeID, me.userID, me.subjectID, us.unique_user_id, us.email, us.firstName, us.lastName, us.accountCreationDate, us.verified, us.currentDepartment, us.groupID FROM mentees me JOIN users us ON us.userID=me.userID;


CREATE TABLE IF NOT EXISTS MENTOR_MENTEE_RELATION (
    relationID serial,
    mentorID integer,
    menteeID integer,
    primary key (relationID),
    foreign key (mentorID) references MENTORS(mentorID),
    foreign key (menteeID) references MENTEES(menteeID)
);

CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
    notificationID serial,
    notificationTypeID integer,
    userID integer,
    permissionText text,
    emailed boolean,
    primary key (notificationID),
    foreign key (notificationTypeID) references NOTIFICATION_TYPE(notificationTypeID),
    foreign key (userID) references USERS(userID)
);


CREATE OR REPLACE VIEW view_InheritedGroups AS WITH RECURSIVE inherited_groups AS (
	SELECT groupID, groupID as inheritedGroupID FROM PERMISSION_GROUPS
	UNION
		SELECT ig.groupID, gi.inheritedGroupID as inheritedGroupID FROM PERMISSION_GROUP_INHERITANCES gi
		INNER JOIN inherited_groups ig ON gi.groupID = ig.inheritedGroupID
) SELECT * FROM inherited_groups;

CREATE OR REPLACE VIEW view_GroupPermissions AS SELECT ig.groupID, ig.inheritedGroupID, gp.groupPermission, gp.permissionvalue FROM view_InheritedGroups ig JOIN PERMISSION_GROUP_PERMISSIONS gp ON ig.inheritedGroupID=gp.groupID;
CREATE OR REPLACE VIEW view_ApplyingGroupPermissions AS SELECT DISTINCT groupID, groupPermission FROM view_GroupPermissions WHERE permissionValue=True;

DROP FUNCTION IF EXISTS hasPermission;

CREATE OR REPLACE FUNCTION hasPermission(funcUserID integer, perm TEXT)
    returns BOOLEAN
    LANGUAGE plpgsql
    AS
    $$
        DECLARE
            funcGroupID integer;
			permissionCount integer;
			hasPerm bool;
        BEGIN
            SELECT groupID FROM USERS WHERE userID=funcUserID LIMIT 1 INTO funcGroupID;
			SELECT CASE WHEN COUNT(groupPermission) IS NULL THEN 0 ELSE COUNT(groupPermission) END FROM view_ApplyingGroupPermissions WHERE groupID=funcGroupID AND groupPermission=perm INTO permissionCount;
			SELECT CASE WHEN permissionCount=0 THEN False ELSE True END INTO hasPerm;
            RETURN hasPerm;
        END;
    $$;

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

CREATE TABLE IF NOT EXISTS USER_LOGIN_TOKENS (
    tokenID serial,
    userID integer,
    loginToken varchar(128),
    loginDate timestamp default current_timestamp(0),
    loginTimeout timestamp default add_minutes_to_timestamp_with_timezone(current_timestamp(0), 60),
    primary key (tokenID),
    foreign key (userID) references USERS(userID)
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