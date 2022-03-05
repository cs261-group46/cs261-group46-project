import { useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserDataContext from "../../store/UserDataContext";

const UseVerifyAuth = (
  minPermissionLevel: number | undefined = 0,
  isProtected = true
) => {
  const navigate = useNavigate();
  const userDataCtx = useContext(UserDataContext);

  const verifyAuth = useCallback(async () => {
    let userId;

    if (userDataCtx.userId === undefined || userDataCtx.userId === null) {
      userId = await userDataCtx.updateUserId();
    } else {
      userId = userDataCtx.userId;
    }

    console.log(userId);

    let permissions;

    if (userDataCtx.permissions === null) {
      permissions = await userDataCtx.updatePermissions();
    } else {
      permissions = userDataCtx.permissions;
    }
    // console.log(userId);

    try {
      if (!userId) {
        throw new Error("User not logged in");
      }

      if (permissions == null || permissions < minPermissionLevel) {
        navigate("/dashboard");
      }

      // userDataCtx.updateMentorId();
      // userDataCtx.updateExpertId();
      // userDataCtx.updateMenteeId();

      // make sure its not in a testing environment - this will break
      if (!isProtected && process.env.JEST_WORKER_ID === undefined)
        navigate("/dashboard");
    } catch (errors) {
      console.log(errors);
      // make sure its not in a testing environment - this will break
      if (isProtected && process.env.JEST_WORKER_ID === undefined)
        navigate("/login");
    }
  }, [isProtected, minPermissionLevel, navigate, userDataCtx]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
};

export default UseVerifyAuth;
