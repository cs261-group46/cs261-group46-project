import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../api/api";

interface VerifierProps {
  dataPoint: string;
  userId: number;
  redirectOnFail?: string | null;
}

const UseVerifyUserData = () => {
  const navigate = useNavigate();

  return useCallback(
    async ({ dataPoint, userId, redirectOnFail = null }: VerifierProps) => {
      try {
        if (!userId) {
          throw new Error("Verification Failed");
        }

        const data = await get({
          resource: "users",
          entity: userId,
          args: {
            fields: [dataPoint],
          },
        });

        // https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference
        const val =
          dataPoint.split(".").reduce((o, i) => o[i], data.user) || data;

        if (val !== undefined) return val;
        else {
          throw new Error("Verification Failed");
        }
      } catch (error) {
        if (redirectOnFail) navigate(redirectOnFail);
        return null;
      }
    },
    [navigate]
  );

  // useEffect(() => {
  //   verifyInfo();
  // }, [verifyInfo]);
};

export default UseVerifyUserData;
