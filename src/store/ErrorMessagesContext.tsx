import React, { FC, useState } from "react";

interface IErrorMessagesContext {
  setErrorsHandler: (errors: string[] | string) => void;
  removeErrorHandler: (id: number) => void;
  errors: { id: number; message: string }[];
  getErrorMessage: (error: unknown) => string | string[];
}

const ErrorMessagesContext = React.createContext<IErrorMessagesContext>({
  errors: [],
  setErrorsHandler: (errors: string[] | string) => {},
  removeErrorHandler: (id: number) => {},
  getErrorMessage: (error: unknown) => [],
});

export const ErrorMessagesContextProvider: FC = ({ children }) => {
  const [errors, setErrors] = useState<{ id: number; message: string }[]>([]);

  const setErrorsHandler = (errorMessages: string[] | string) => {
    console.log(errorMessages);

    if (typeof errorMessages === "string" || errorMessages instanceof String) {
      console.log("is string");

      setErrors([{ id: 1, message: errorMessages as string }]);
    } else {
      const errsMessages = errorMessages as string[];
      const errs = errsMessages.map((message, i) => ({
        message: message,
        id: i,
      }));
      setErrors(errs);
    }
  };

  const removeErrorHandler = (errorId: number) => {
    setErrors((prevErrors) => prevErrors.filter((err) => err.id !== errorId));
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const contextValue = {
    errors,
    setErrorsHandler,
    removeErrorHandler,
    getErrorMessage,
  };

  return (
    <ErrorMessagesContext.Provider value={contextValue}>
      {children}
    </ErrorMessagesContext.Provider>
  );
};

export default ErrorMessagesContext;
