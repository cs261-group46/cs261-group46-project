import React, { FC, useCallback, useState } from "react";

interface ISystemMessagesContext {
  addMessageHandler: (
    type: "error" | "success",
    errors: string[] | string | unknown
  ) => void;
  removeMessageHandler: (messageId: number) => void;
  messages: { id: number; message: string; type: "error" | "success" }[];
}

const SystemMessagesContext = React.createContext<ISystemMessagesContext>({
  messages: [],
  addMessageHandler: (
    type: "error" | "success",
    errors: string[] | string | unknown
  ) => {},
  removeMessageHandler: (messageId: number) => {},
});

type MessageType = { id: number; message: string; type: "error" | "success" };

export const SystemMessagesContextProvider: FC = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const addMessageHandler = useCallback(
    (type: "error" | "success", message: string[] | string | unknown) => {
      if (type === "error")
        if (message instanceof Error) message = message.message;
        else message = String(message);

      if (typeof message === "string" || message instanceof String) {
        setMessages((prev) => {
          const greatestId =
            prev.length > 0
              ? Math.max.apply(
                  Math,
                  prev.map(function (message: MessageType) {
                    return message.id;
                  })
                )
              : 0;

          return [
            ...prev,
            { id: greatestId + 1, message: message as string, type },
          ];
        });
      } else {
        const ms = message as string[];
        setMessages((prev) => {
          const greatestId =
            prev.length > 0
              ? Math.max.apply(
                  Math,
                  prev.map(function (message: MessageType) {
                    return message.id;
                  })
                )
              : 0;
          const newMessages = ms.map((message, i) => ({
            message,
            id: greatestId + i + 1,
            type,
          }));
          return [...prev, ...newMessages];
        });
      }
    },
    []
  );

  const removeMessageHandler = useCallback((messageId: number) => {
    setMessages((prevErrors) =>
      prevErrors.filter((err) => err.id !== messageId)
    );
  }, []);

  const contextValue = {
    messages,
    addMessageHandler,
    removeMessageHandler,
  };

  return (
    <SystemMessagesContext.Provider value={contextValue}>
      {children}
    </SystemMessagesContext.Provider>
  );
};

export default SystemMessagesContext;
