import React, {
  FC,
  useEffect,
  useState,
} from "react";

interface UserDataContext {
  isLoggedIn: boolean;
  isExpert: boolean;
  isMentee: boolean;
  isMentor: boolean;
  setExpertStatus: (status: boolean) => void;
  setMenteeStatus: (status: boolean) => void;
  setMentorStatus: (status: boolean) => void;
  setLoggedInStatus: (status: boolean) => void;
}

const UserDataContext = React.createContext<UserDataContext>({
  isLoggedIn: false,
  isExpert: false,
  isMentee: false,
  isMentor: false,
  setExpertStatus: (status) => {},
  setMenteeStatus: (status) => {},
  setMentorStatus: (status) => {},
  setLoggedInStatus: (status) => {},
});

export const UserDataContextProvider: FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [isMentee, setIsMentee] = useState(false);

  const setExpertStatus = (status: boolean) => {
    setIsExpert(status);
  };
  const setMenteeStatus = (status: boolean) => {
    setIsMentor(status);
  };
  const setMentorStatus = (status: boolean) => {
    setIsMentee(status);
  };
  const setLoggedInStatus = (status: boolean) => {
    setIsLoggedIn(status);
  };

  const verifyExpertStatus = async () => {
    const response = await fetch("/api/experts/verify");
    const returnedData = await response.json();
    setIsExpert(returnedData.isExpert);
  };

  const verifyMentorStatus = async () => {
    const response = await fetch("/api/mentors/verify");
    const returnedData = await response.json();
    setIsMentor(returnedData.isMentor);
  };

  useEffect(() => {
    if (isLoggedIn) verifyExpertStatus();
    if (isLoggedIn) verifyMentorStatus();
  }, [isLoggedIn]);

  const contextValue = {
    isLoggedIn,
    isExpert,
    isMentee,
    isMentor,
    setExpertStatus,
    setMenteeStatus,
    setMentorStatus,
    setLoggedInStatus,
  };
  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
