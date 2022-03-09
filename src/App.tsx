import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import "./App.scss";
import Register from "./routes/Auth/Register/Register.lazy";
import Dashboard from "./routes/Dashboard/Dashboard.lazy";
import VerifyEmail from "./routes/Auth/Register/VerifyEmail/VerifyEmail.lazy";
import Setup from "./routes/Setup/Setup";
import MentorSignup from "./routes/mentor/MentorSignup/MentorSignup.lazy";
import MenteeSignup from "./routes/learn/MenteeSignup/MenteeSignup";
import Login from "./routes/Auth/Login/Login";
import YourInterests from "./routes/learn/Interests/Interests";
import MentorSkills from "./routes/mentor/MentorSkills/MentorSkills";
import ExpertExpertises from "./routes/expert/ExpertExpertises/ExpertExpertises.lazy";
import Homepage from "./routes/Homepage/Homepage.lazy";
import ViewGroupSessions from "./routes/learn/ViewGroupSessions/ViewGroupSessions.lazy";
import ComponentPlaygound from "./routes/ComponentPlaygound/ComponentPlaygound.lazy";
import UpcomingEvents from "./routes/UpcomingEvents/UpcomingEvents.lazy";
import YourMentor from "./routes/learn/YourMentor/YourMentor";
import ExpertSignup from "./routes/expert/ExpertSignup/ExpertSignup";
import YourMentees from "./routes/mentor/YourMentees/YourMentees";
import FindMentor from "./routes/learn/FindMentor/FindMentor";
import CreateGroupSession from "./routes/expert/CreateGroupSession/CreateGroupSession.lazy";
import YourGroupSessions from "./routes/expert/YourGroupSessions/YourGroupSessions";

import YourProfile from "./routes/YourProfile/YourProfile";
import Profile from "./routes/Profile/Profile";
import EditPlansOfAction from "./routes/EditPlansOfAction/EditPlansOfAction";
import SiteFeedback from "./routes/SiteFeedback/SiteFeedback.lazy";
import Meetings from "./routes/meetings/Meetings/Meetings";
import CreateMeeting from "./routes/meetings/CreateMeeting/CreateMeeting";
import MentorFeedback from "./routes/learn/MentorFeedback/MentorFeedback.lazy";
import PastMentors from "./routes/learn/PastMentors/PastMentors";
import GiveFeedbackToMentor from "./routes/learn/GiveFeedbackToMentor/GiveFeedbackToMentor";
import GiveFeedbackToMentee from "./routes/mentor/GiveFeedbackToMentee/GiveFeedbackToMentee.lazy";

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
          <Route path="/setup" element={<Setup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<YourProfile />} />
          <Route
            path="/plans-of-action/:menteeId"
            element={<EditPlansOfAction />}
          />
          <Route
            path="/meetings/:menteeId/create"
            element={<CreateMeeting />}
          />
          <Route path="/meetings/:menteeId" element={<Meetings />} />
          <Route path="/calendar" element={<UpcomingEvents />} />
          <Route path="/profile2" element={<Profile />} />
          <Route
            path="/mentor/past-mentees/give-feedback/:menteeId"
            element={<GiveFeedbackToMentee />}
          />
          <Route path="/mentor">
            <Route path="become-mentor" element={<MentorSignup />} />
            <Route path="skills" element={<MentorSkills />} />
            <Route path="become-mentor" element={<MentorSignup />} />
            <Route path="your-mentees" element={<YourMentees />} />
          </Route>
          <Route
            path="/learn/past-mentors/give-feedback/:mentorId"
            element={<GiveFeedbackToMentor />}
          />
          <Route path="/learn">
            <Route path="past-mentors" element={<PastMentors />} />
            <Route path="become-mentee" element={<MenteeSignup />} />
            <Route path="find-mentor" element={<FindMentor />} />
            <Route path="your-mentor" element={<YourMentor />} />
            <Route path="group-sessions" element={<ViewGroupSessions />} />
            <Route path="interests" element={<YourInterests />} />
            <Route path="give-feedback" element={<MentorFeedback />} />
          </Route>
          <Route path="/expert">
            <Route path="group-sessions">
              <Route path="create" element={<CreateGroupSession />} />
              <Route index element={<YourGroupSessions />} />
            </Route>
            <Route path="skills" element={<ExpertExpertises />} />
            <Route path="become-expert" element={<ExpertSignup />} />
          </Route>
          <Route path="/feedback" element={<SiteFeedback />} />
          {/* <Route path="/workshops">
            <Route index element={<ViewWorkshops />} />
            <Route path={"create"} element={<CreateWorkshop />} />
          </Route> */}
          <Route path="/test" element={<ComponentPlaygound />} />
          <Route index element={<Homepage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
