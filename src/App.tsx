import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [helloWorldStr, setHelloWorldStr] = useState("");

  const fetchHelloWorld = async () => {
    const response = await fetch("/api/helloworld");
    const data = await response.json();
    setHelloWorldStr(data.helloworld);
  };

  useEffect(() => {
    fetchHelloWorld();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React : {helloWorldStr}
        </a>
      </header>
    </div>
  );
}

export default App;
