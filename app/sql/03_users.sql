CREATE TABLE IF NOT EXISTS USERS (
    id serial,
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
    primary key (id),
    foreign key (currentDepartment) references DEPARTMENTS(id),
    foreign key (groupID) references PERMISSION_GROUPS(groupID)
);

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
            SELECT groupID FROM USERS WHERE id=funcUserID LIMIT 1 INTO funcGroupID;
			SELECT CASE WHEN COUNT(groupPermission) IS NULL THEN 0 ELSE COUNT(groupPermission) END FROM view_ApplyingGroupPermissions WHERE groupID=funcGroupID AND groupPermission=perm INTO permissionCount;
			SELECT CASE WHEN permissionCount=0 THEN False ELSE True END INTO hasPerm;
            RETURN hasPerm;
        END;
    $$;