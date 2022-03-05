import { useEffect, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { custom, get } from "../../api/api";
=======
>>>>>>> f47ff9505f81784699b4533a6953b0bd794cd6ea
import UserDataContext from "../../store/UserDataContext";
import UseVerifyUserData from "../UseVerifyUserData/UseVerifyUserData";

interface AuthVerifierProps {
  minPermissionLevel?: number;
  isProtected?: boolean;
}

const UseVerifyAuth = () => {
  const navigate = useNavigate();

  const userDataVerifier = UseVerifyUserData();

  const verifyAuth = useCallback(
    async ({
      minPermissionLevel = 0,
      isProtected = true,
    }: AuthVerifierProps) => {
      try {
        const { user: userId } = await custom({
          endpoint: "/users/loggedin",
          method: "GET",
        });

        if (!userId) {
          throw new Error("User not logged in");
        }

        const permissions: number | null = await userDataVerifier({
          dataPoint: "permissions",
          userId,
          redirectOnFail: "/dashboard",
        });


        if (permissions === null || permissions < minPermissionLevel) {
          navigate("/dashboard");
          return null;
        }

        // make sure its not in a testing environment - this will break
        if (!isProtected && process.env.JEST_WORKER_ID === undefined) {
          navigate("/dashboard");
          return null;
        }

        return userId;
      } catch (errors) {
        // make sure its not in a testing environment - this will break
        if (isProtected && process.env.JEST_WORKER_ID === undefined) {
          navigate("/login");
          return null;
        }
        return null;
      }
    },
    [navigate, userDataVerifier]
  );

  return verifyAuth;
};

export default UseVerifyAuth;
