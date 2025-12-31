import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Dashboard from "./pages/Dashboard";
import ProjectIssues from "./pages/ProjectIssues";
import Milestones from "./pages/Milestones";
import GenAI from "./pages/GenAI";
import Analytics from "./pages/Analytics";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
// Placeholder components for future routes
const ProjectsPage = () => (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Projects" }), _jsx("p", { className: "text-gray-600", children: "This page will be implemented soon." })] }) }));
const SettingsPage = () => (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Settings" }), _jsx("p", { className: "text-gray-600", children: "Settings are configured server-side." })] }) }));
export default function App() {
    return (_jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/project/:projectKey", element: _jsx(ProjectIssues, {}) }), _jsx(Route, { path: "/project/:projectKey/milestones", element: _jsx(Milestones, {}) }), _jsx(Route, { path: "/genai", element: _jsx(GenAI, {}) }), _jsx(Route, { path: "/project/:projectKey/genai", element: _jsx(GenAI, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectsPage, {}) }), _jsx(Route, { path: "/analytics", element: _jsx(Analytics, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) })] })] }) }));
}
