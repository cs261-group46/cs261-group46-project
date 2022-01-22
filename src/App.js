import styles from "./App.css";
import React, {useState, useEffect} from "react";

const App = () => {
  const getCookie = async () => {
    const response = await fetch("/token", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        "email": "test",
        "password": "test"
      })
    })

    console.log(response)
    const data = await response.json()
    console.log(data)
    return data
  }
  useEffect(()=> {
    getCookie()
  }, [])
  return (
    <div className={styles.App}>
      This works
    </div>
  );
};

export default App;
