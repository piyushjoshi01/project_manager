import Dashboard from "./pages/Dashboard";
import ProjectIssues from "./pages/ProjectIssues";
import Milestones from "./pages/Milestones";
import GenAI from "./pages/GenAI";
import Analytics from "./pages/Analytics";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";

// Placeholder components for future routes
const ProjectsPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects</h2>
      <p className="text-gray-600">This page will be implemented soon.</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
      <p className="text-gray-600">Settings are configured server-side.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:projectKey" element={<ProjectIssues />} />
          <Route path="/project/:projectKey/milestones" element={<Milestones />} />
          <Route path="/genai" element={<GenAI />} />
          <Route path="/project/:projectKey/genai" element={<GenAI />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
