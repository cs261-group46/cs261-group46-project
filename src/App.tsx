import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import "./App.scss";
import Register from "./routes/Register/Register.lazy";
import Dashboard from "./routes/Dashboard/Dashboard.lazy";
import Setup from "./routes/Setup/Setup";
import MentorSignup from "./routes/mentor/MentorSignup/MentorSignup.lazy";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/setup" element={<Setup />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/mentor">
            <Route path="become-mentor" element={<MentorSignup/>}/>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
