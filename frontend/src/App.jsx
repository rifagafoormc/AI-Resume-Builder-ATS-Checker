import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import BasicDetails from "./pages/BasicDetails";
import Experience from "./pages/Experience";
import ResumePreview from "./pages/ResumePreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/basic-details" element={<BasicDetails />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

