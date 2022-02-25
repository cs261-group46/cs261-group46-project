import React, {
  ChildContextProvider,
  ContextType,
  FC,
  useEffect,
  useState,
} from "react";

interface UserDataContext {
  isExpert: boolean;
  isMentee: boolean;
  isMentor: boolean;
  updateExpertStatusHandler: (status: boolean) => void;
  updateMenteeStatusHandler: (status: boolean) => void;
  updateMentorStatusHandler: (status: boolean) => void;
  updateLoggedInStatusHandler: (status: boolean) => void;
}

const UserDataContext = React.createContext<UserDataContext>({
  isExpert: false,
  isMentee: false,
  isMentor: false,
  updateExpertStatusHandler: (status) => {},
  updateMenteeStatusHandler: (status) => {},
  updateMentorStatusHandler: (status) => {},
  updateLoggedInStatusHandler: (status) => {},
});

export const UserDataContextProvider: FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [isMentee, setIsMentee] = useState(false);

  const updateExpertStatusHandler = (status: boolean) => {
    setIsExpert(status);
  };
  const updateMenteeStatusHandler = (status: boolean) => {
    setIsMentor(status);
  };
  const updateMentorStatusHandler = (status: boolean) => {
    setIsMentee(status);
  };
  const updateLoggedInStatusHandler = (status: boolean) => {
    setIsLoggedIn(status);
  };

  const verifyExpertStatus = async () => {
    const response = await fetch("/api/experts/verify");
    const returnedData = await response.json();
    setIsExpert(returnedData.isExpert);
  };

  useEffect(() => {
    if (isLoggedIn) verifyExpertStatus();
  }, [isLoggedIn]);

  const contextValue = {
    isExpert,
    isMentee,
    isMentor,
    updateExpertStatusHandler,
    updateMenteeStatusHandler,
    updateMentorStatusHandler,
    updateLoggedInStatusHandler,
  };
  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
