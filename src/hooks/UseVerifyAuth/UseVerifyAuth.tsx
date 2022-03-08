import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { custom } from "../../api/api";
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
