import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import "./App.scss";
import Register from "./routes/Auth/Register/Register.lazy";
import Dashboard from "./routes/Dashboard/Dashboard.lazy";
import VerifyEmail from "./routes/Auth/Register/VerifyEmail/VerifyEmail.lazy";
import Setup from "./routes/Setup/Setup";
import MentorSignup from "./routes/mentor/MentorSignup/MentorSignup.lazy";
import MenteeSignup from "./routes/learn/FindMentor/FindMentor.lazy";
import Login from "./routes/Auth/Login/Login";
import YourInterests from "./routes/learn/Interests/Interests";
import MentorSkills from "./routes/mentor/MentorSkills/MentorSkills";
import ExpertExpertises from "./routes/expert/ExpertExpertises/ExpertExpertises.lazy";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register">
            <Route path="" element={<Register />} />
            <Route path="verifyemail" element={<VerifyEmail />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/mentor">
            <Route path="become-mentor" element={<MentorSignup />} />
            <Route path="skills" element={<MentorSkills />} />
          </Route>
          <Route path="/learn">
            <Route path="find-mentor" element={<MenteeSignup />} />
            <Route path="interests" element={<YourInterests />} />
          </Route>

          <Route path="/expert">
            {/* <Route path="become-expert" element={<MenteeSignup />} /> */}
            <Route path="skills" element={<ExpertExpertises />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
