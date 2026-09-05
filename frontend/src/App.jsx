import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import BasicDetails from "./pages/BasicDetails";
import Education from "./pages/Education";
import ExperienceSkills from "./pages/ExperienceSkills";
import Projects from "./pages/Projects";
import CertificationsLanguages from "./pages/CertificationsLanguages";
import ResumePreview from "./pages/ResumePreview";
import ATSScore from "./pages/ATSScore";        
import ATSResult from "./pages/ATSResult";      
import MyResumes from "./pages/MyResumes";
import ATSHistory from "./pages/ATSHistory";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResumes from "./pages/AdminResumes";
import AdminUsers from "./pages/AdminUsers";
import AdminATS from "./pages/AdminATS";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        
        {/* Route for creating a NEW resume */}
        <Route path="/basic-details" element={<BasicDetails />} />
        
        {/* Route for EDITING an EXISTING resume (preserves the _id) */}
        <Route path="/basic-details/:id" element={<BasicDetails />} />
        
        <Route path="/education" element={<Education />} />
        <Route path="/experience-skills" element={<ExperienceSkills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certifications-languages" element={<CertificationsLanguages />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
        
        <Route path="/ats-score" element={<ATSScore />} />      
        <Route path="/ats-result" element={<ATSResult />} />    
        <Route path="/my-resumes" element={<MyResumes />} />
        <Route  path="/ats-history"  element={<ATSHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route  path="/admin-dashboard"  element={<AdminDashboard />} />
        <Route  path="/admin-resumes"  element={<AdminResumes />} />
        <Route path="/admin-users" element={<AdminUsers />} /> 
        <Route path="/admin-ats" element={<AdminATS />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;