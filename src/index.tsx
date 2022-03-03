import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserDataContextProvider } from "./store/UserDataContext";
import { ErrorMessagesContextProvider } from "./store/ErrorMessagesContext";

ReactDOM.render(
  <React.StrictMode>
    <ErrorMessagesContextProvider>
      <UserDataContextProvider>
        <App />
      </UserDataContextProvider>
    </ErrorMessagesContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
