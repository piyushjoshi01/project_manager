import Dashboard from "./pages/Dashboard";
import ProjectIssues from "./pages/ProjectIssues";
import Milestones from "./pages/Milestones";
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

const AnalyticsPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
      <p className="text-gray-600">This page will be implemented soon.</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
      <p className="text-gray-600">This page will be implemented soon.</p>
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
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
