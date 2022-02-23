import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import "./App.scss";
import Register from "./routes/Register/Register.lazy";
import Dashboard from "./routes/Dashboard/Dashboard.lazy";
import VerifyEmail from "./routes/Register/VerifyEmail/VerifyEmail.lazy"
import Expert from "./routes/Expert/Expert.lazy"
import Setup from "./routes/Setup/Setup";
import MentorSignup from "./routes/mentor/MentorSignup/MentorSignup.lazy";
import MenteeSignup from "./routes/learn/MenteeSignup/MenteeSignup.lazy";

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register/verifyemail" element={<VerifyEmail/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/expert" element={<Expert/>}/>
          <Route path="/setup" element={<Setup />} />
          <Route path="/mentor">
          <Route path="become-mentor" element={<MentorSignup/>}/>
          </Route>
          <Route path="/learn">
            <Route path="become-mentee" element={<MenteeSignup/>}/>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
