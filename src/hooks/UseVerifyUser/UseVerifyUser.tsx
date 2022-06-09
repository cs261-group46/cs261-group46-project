import { useCallback, useEffect, useState } from "react";
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
  redirectOnSuccess?: string | null;
};

function UseVerifyUser<T extends { [key: string]: any }>({
  minPermissionLevel = 0,
  isProtected = true,
  userDataPolicies = [],
}: UseVerifyUserProps) {
  const [userData, setUserData] = useState<T>({} as T);

  const authVerifier = UseVerifyAuth();

  const dataVerifier = UseVerifyUserData();

  const verify = useCallback(
    async () => {
      let userDataDict = {};

      const id = await authVerifier({
        minPermissionLevel,
        isProtected,
      });

      for (const {
        dataPoint,
        redirectOnFail,
        redirectOnSuccess,
      } of userDataPolicies) {
        if ((dataPoint || dataPoint === "") && id) {
          const returnedData = await dataVerifier({
            dataPoint,
            userId: id,
            redirectOnFail,
            redirectOnSuccess,
          });

          const transformDataPoint = dataPoint.replace(/\./g, "_");

          userDataDict = {
            ...userDataDict,
            [transformDataPoint.length === 0 ? "user" : transformDataPoint]:
              returnedData,
          };
        }
      }
      userDataDict = {
        ...userDataDict,
        userId: id,
      };

      setUserData(userDataDict as T);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      authVerifier,
      dataVerifier,
      isProtected,
      minPermissionLevel,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(userDataPolicies),
    ]
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return { ...userData, stateChangingHandler: setUserData };
}

export default UseVerifyUser;
