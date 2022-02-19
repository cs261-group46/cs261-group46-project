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

CREATE OR REPLACE VIEW view_InheritedGroups AS WITH RECURSIVE inherited_groups AS (
	SELECT groupID, groupID as inheritedGroupID FROM PERMISSION_GROUPS
	UNION
		SELECT ig.groupID, gi.inheritedGroupID as inheritedGroupID FROM PERMISSION_GROUP_INHERITANCES gi
		INNER JOIN inherited_groups ig ON gi.groupID = ig.inheritedGroupID
) SELECT * FROM inherited_groups;

CREATE OR REPLACE VIEW view_GroupPermissions AS SELECT ig.groupID, ig.inheritedGroupID, gp.groupPermission, gp.permissionvalue FROM view_InheritedGroups ig JOIN PERMISSION_GROUP_PERMISSIONS gp ON ig.inheritedGroupID=gp.groupID;
CREATE OR REPLACE VIEW view_ApplyingGroupPermissions AS SELECT DISTINCT groupID, groupPermission FROM view_GroupPermissions WHERE permissionValue=True;