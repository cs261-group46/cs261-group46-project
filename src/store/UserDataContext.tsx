import React, { FC, useCallback, useEffect, useState } from "react";
import { custom, get } from "../api/api";

interface IUserDataContext {
  userId: number | null | undefined;
  expertId: number | null;
  mentorId: number | null;
  menteeId: number | null;
  permissions: number | null;
  updateExpertId: () => Promise<number>;
  updateMentorId: () => Promise<number>;
  updateMenteeId: () => Promise<number>;
  updateUserId: () => Promise<number>;
  updatePermissions: () => Promise<number>;
}

const UserDataContext = React.createContext<IUserDataContext>({
  userId: undefined,
  expertId: null,
  mentorId: null,
  menteeId: null,
  permissions: null,
  updateExpertId: () => {
    return new Promise((resolve) => resolve(0));
  },
  updateMentorId: () => {
    return new Promise((resolve) => resolve(0));
  },
  updateMenteeId: () => {
    return new Promise((resolve) => resolve(0));
  },
  updateUserId: () => {
    return new Promise((resolve) => resolve(0));
  },
  updatePermissions: () => {
    return new Promise((resolve) => resolve(0));
  },
});

export const UserDataContextProvider: FC = ({ children }) => {
  const [userId, setUserId] = useState<number | null | undefined>(undefined);
  const [expertId, setExpertId] = useState<number | null>(null);
  const [mentorId, setMentorId] = useState<number | null>(null);
  const [menteeId, setMenteeId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<number | null>(null);

  const updateUserId = useCallback(async () => {
    try {
      const loggedInUser = await custom({
        endpoint: "/users/loggedin",
        method: "GET",
      });

      setUserId(loggedInUser.user);
      return loggedInUser.user;
    } catch (errors) {
      setUserId(null);
      return null;
    }
  }, []);

  const updatePermissions = useCallback(async () => {
    let user_id = userId;
    if (user_id === undefined) {
      user_id = await updateUserId();
    }
    if (user_id == null) {
      setPermissions(null);
      return null;
    }

    try {
      const data = await get({
        resource: "users",
        entity: user_id,
        args: {
          fields: ["permissions"],
        },
      });
      setPermissions(data.user.permissions ?? null);
      return data.user.permissions ?? null;
    } catch (errors) {
      setPermissions(null);
      return null;
    }
  }, [updateUserId, userId]);

  const updateExpertId = useCallback(async () => {
    let user_id = userId;
    if (user_id === undefined) {
      user_id = await updateUserId();
    }
    if (user_id == null) {
      setExpertId(null);
      return null;
    }

    try {
      const data = await get({
        resource: "users",
        entity: user_id,
        args: {
          fields: ["expert"],
        },
      });
      setExpertId(data.user.expert.id ?? null);
      return data.user.expert.id ?? null;
    } catch (errors) {
      setExpertId(null);
      return null;
    }
  }, [updateUserId, userId]);

  const updateMentorId = useCallback(async () => {
    let user_id = userId;
    if (user_id === undefined) {
      user_id = await updateUserId();
    }
    if (user_id == null) {
      setMentorId(null);
      return null;
    }

    try {
      const data = await get({
        resource: "users",
        entity: user_id,
        args: {
          fields: ["mentor"],
        },
      });
      setMentorId(data.user.mentor.id ?? null);
      return data.user.mentor.id ?? null;
    } catch (errors) {
      setMentorId(null);
      return null;
    }
  }, [updateUserId, userId]);

  const updateMenteeId = useCallback(async () => {
    let user_id = userId;
    if (user_id === undefined) {
      user_id = await updateUserId();
    }
    if (user_id == null) {
      setMenteeId(null);
      return null;
    }

    try {
      const data = await get({
        resource: "users",
        entity: user_id,
        args: {
          fields: ["mentee"],
        },
      });
      setMenteeId(data.user.mentee.id ?? null);
      return data.user.mentee.id ?? null;
    } catch (errors) {
      setMenteeId(null);
      return null;
    }
  }, [updateUserId, userId]);

  useEffect(() => {
    updateUserId();
    updateMenteeId();
    updateMentorId();
    updateExpertId();
    updatePermissions();
  }, [
    updateExpertId,
    updateMenteeId,
    updateMentorId,
    updatePermissions,
    updateUserId,
  ]);

  const contextValue = {
    permissions,
    userId,
    expertId,
    menteeId,
    mentorId,
    updateExpertId,
    updateMenteeId,
    updateMentorId,
    updateUserId,
    updatePermissions,
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
