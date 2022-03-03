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
import Homepage from "./routes/Homepage/Homepage.lazy";
import ViewWorkshops from "./routes/workshops/ViewWorkshops/ViewWorkshops.lazy";
import ComponentPlaygound from "./routes/ComponentPlaygound/ComponentPlaygound.lazy";
import PlansOfAction from "./routes/learn/PlansOfAction/PlansOfAction.lazy";
import UpcomingEvents from "./routes/UpcomingEvents/UpcomingEvents.lazy";
import { EventProps } from "./components/UpcommingEvents/Event/Event.d";
import YourMentor from "./routes/learn/YourMentor/YourMentor";
import ExpertSignup from "./routes/expert/ExpertSignup/ExpertSignup";
import YourMentees from "./routes/mentor/YourMentees/YourMentees";
import CreateWorkshop from "./routes/CreateWorkshop/CreateWorkshop.lazy";

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
          <Route path="/calendar" element={<UpcomingEvents />} />

          <Route path="/mentor">
            <Route path="become-mentor" element={<MentorSignup />} />
            <Route path="skills" element={<MentorSkills />} />
            <Route path="become-mentor" element={<MentorSignup/>}/>
            <Route path="your-mentees" element={<YourMentees/>}/>
          </Route>

          <Route path="/learn">
            <Route path="find-mentor" element={<MenteeSignup />} />
            <Route path="your-mentor" element={<YourMentor />} />

            <Route path="interests" element={<YourInterests />} />
            <Route path="plans-of-action" element={<PlansOfAction />} />
          </Route>

          <Route path="/expert">
            <Route path="skills" element={<ExpertExpertises />} />
            <Route path="become-expert" element={<ExpertSignup />} />
          </Route>

          <Route path="/workshops">
            <Route index element={<ViewWorkshops />} />
            <Route path={"create"} element={<CreateWorkshop/>}/>
          </Route>
          <Route path="/test" element={<ComponentPlaygound />} />
          <Route index element={<Homepage />} />

          {/* <Route
            path="/upcoming-events"
            element={
              <UpcomingEvents
                events={
                  [
                    {
                      sessionType: "Group Session",
                      subject: "Engineering",
                      mentee: "Reiss",
                      mentor: "Mohammed",
                    },
                    {
                      sessionType: "Workshop",
                      subject: "Engineering",
                      mentee: "Mohammed",
                      mentor: "Reiss",
                    },
                  ] as EventProps[]
                }
              />
            }
          /> */}
          {/* <Route path='/plans-of-action' element={<PlansOfAction />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
