import React from 'react';
import {Routes, BrowserRouter, Route} from "react-router-dom";
import './App.scss';
import Button from "./components/UI/Button/Button";
import Register from "./routes/Register/Register.lazy";
import MainLayout from "./layouts/MainLayout/MainLayout";

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