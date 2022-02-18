import React from 'react';
import {Routes, BrowserRouter, Route} from "react-router-dom";
import './App.scss';
import Register from "./routes/Register/Register.lazy";
import Dashboard from "./routes/Dashboard/Dashboard.lazy";
import VerifyRegister from "./routes/VerifyRegister/VerifyRegister.lazy"
import Expert from "./routes/Expert/Expert.lazy"

function App() {


  return (
      <BrowserRouter>
        <div className="App">
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/verifyregister" element={<VerifyRegister/>}/>
                <Route path="/expert" element={<Expert/>}/>
            </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;