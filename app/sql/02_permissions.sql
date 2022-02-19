CREATE TABLE PERMISSION_GROUPS (
    id serial,
    name varchar(32),
    primary key (id)
);

CREATE TABLE PERMISSION_GROUP_PERMISSIONS (
    groupID serial,
    groupPermission text,
    permissionValue bool,
    primary key (groupID, groupPermission),
    foreign key (groupID) references PERMISSION_GROUPS(id)
);


CREATE TABLE PERMISSION_GROUP_INHERITANCES (
    groupID serial,
    inheritedGroupID integer,
    primary key (groupID, inheritedGroupID),
    foreign key (groupID) references PERMISSION_GROUPS(id),
    foreign key (inheritedGroupID) references PERMISSION_GROUPS(id)
);

CREATE OR REPLACE VIEW view_InheritedGroups AS WITH RECURSIVE inherited_groups AS (
	SELECT id, id as inheritedGroupID FROM PERMISSION_GROUPS
	UNION
		SELECT ig.id, gi.inheritedGroupID as inheritedGroupID FROM PERMISSION_GROUP_INHERITANCES gi
		INNER JOIN inherited_groups ig ON gi.groupID = ig.inheritedGroupID
) SELECT * FROM inherited_groups;

CREATE OR REPLACE VIEW view_GroupPermissions AS SELECT ig.id, ig.inheritedGroupID, gp.groupPermission, gp.permissionvalue FROM view_InheritedGroups ig JOIN PERMISSION_GROUP_PERMISSIONS gp ON ig.inheritedGroupID=gp.groupID;
CREATE OR REPLACE VIEW view_ApplyingGroupPermissions AS SELECT DISTINCT id, groupPermission FROM view_GroupPermissions WHERE permissionValue=True;