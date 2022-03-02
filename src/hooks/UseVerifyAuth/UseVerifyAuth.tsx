import { useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { custom, get } from "../../api/api";
import UserDataContext from "../../store/UserDataContext";

const UseVerifyAuth = (
  minPermissionLevel: number | undefined = 0,
  isProtected = true
) => {
  const navigate = useNavigate();
  const userDataCtx = useContext(UserDataContext);

  const verifyAuth = useCallback(async () => {
    let userId;
    if (userDataCtx.userId === null || userDataCtx.userId === undefined) {
      userId = await userDataCtx.updateUserId();
    } else {
      userId = userDataCtx.userId;
    }

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

      if (!isProtected) navigate("/dashboard");
    } catch (errors) {
      console.log(errors);
      if (isProtected) navigate("/login");
    }
  }, [isProtected, minPermissionLevel, navigate, userDataCtx]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
};

export default UseVerifyAuth;
