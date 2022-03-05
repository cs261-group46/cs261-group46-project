import React, { FC, useCallback, useEffect, useState } from "react";
import UseVerifyAuth from "../UseVerifyAuth/UseVerifyAuth";
import UseVerifyUserData from "../UseVerifyUserData/UseVerifyUserData";

interface UseVerifyUserProps {
  minPermissionLevel?: number;
  isProtected?: boolean;
  userDataPolicies?: userDataPolicy[];
}

type userDataPolicy = {
  dataPoint: string;
  redirectOnFail?: string | null;
};

function UseVerifyUser<T extends { [key: string]: any }>({
  minPermissionLevel = 0,
  isProtected = true,
  userDataPolicies = [],
}: UseVerifyUserProps) {
  const [userData, setUserData] = useState<T>({} as T);

  const authVerifier = UseVerifyAuth();

  const dataVerifier = UseVerifyUserData();

  const verify = useCallback(async () => {
    let userDataDict = {};

    const id = await authVerifier({
      minPermissionLevel,
      isProtected,
    });

    for (const { dataPoint, redirectOnFail } of userDataPolicies) {
      if (dataPoint && id) {
        const returnedData = await dataVerifier({
          dataPoint,
          userId: id,
          redirectOnFail,
        });

        const transformDataPoint = dataPoint.replace(/\./g, "_");
        userDataDict = { ...userDataDict, [transformDataPoint]: returnedData };
      }
    }
    userDataDict = {
      ...userDataDict,
      userId: id,
    };

    setUserData(userDataDict as T);
  }, [
    authVerifier,
    dataVerifier,
    isProtected,
    minPermissionLevel,
    JSON.stringify(userDataPolicies),
  ]);

  useEffect(() => {
    verify();
    console.log("verifying");
  }, [verify]);

  return userData;
}

export default UseVerifyUser;
