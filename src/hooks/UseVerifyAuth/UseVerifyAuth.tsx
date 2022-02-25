import { useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserDataContext from "../../store/UserDataContext";

const UseVerifyAuth = (minPermissionLevel: number | undefined = 0) => {
  const navigate = useNavigate();
  const userDataCtx = useContext(UserDataContext);

  const { isLoggedIn, setLoggedInStatus } = userDataCtx;

  const verifyAuth = useCallback(async () => {
    const response = await fetch(
      `/api/auth/verify?permission=${minPermissionLevel}`
    );

    const returnedData = await response.json();
    setLoggedInStatus(returnedData.isLoggedIn);

    if (!returnedData.isLoggedIn) navigate("/login");
  }, [minPermissionLevel, navigate, setLoggedInStatus]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth, isLoggedIn]);
};

export default UseVerifyAuth;
