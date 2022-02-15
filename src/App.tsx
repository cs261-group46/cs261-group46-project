import React from 'react';
import {Routes, BrowserRouter, Route} from "react-router-dom";
import './App.scss';
import Register from "./routes/Register/Register.lazy";

function App() {


  return (
      <BrowserRouter>
        <div className="App">
            <Routes>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;