import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import "./App.scss";
import Register from "./routes/Register/Register.lazy";
import Dashboard from "./routes/Dashboard/Dashboard.lazy";
import VerifyRegister from "./routes/VerifyRegister/VerifyRegister.lazy"
import Expert from "./routes/Expert/Expert.lazy"
import Setup from "./routes/Setup/Setup";
import Login from "./routes/Login/Login.lazy";
import MentorSignup from "./routes/mentor/MentorSignup/MentorSignup.lazy";
import MenteeSignup from "./routes/learn/MenteeSignup/MenteeSignup.lazy";
import ComponentPlaygound from "./routes/ComponentPlaygound/ComponentPlaygound.lazy";

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/verifyregister" element={<VerifyRegister/>}/>
          <Route path="/expert" element={<Expert/>}/>
          <Route path="/setup" element={<Setup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mentor">
            <Route path="become-mentor" element={<MentorSignup/>}/>
          </Route>
          <Route path="/learn">
            <Route path="become-mentee" element={<MenteeSignup/>}/>
          </Route>
          <Route path="/test" element={<ComponentPlaygound/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
