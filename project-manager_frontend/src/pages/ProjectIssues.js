import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchIssuesByProject, fetchProjectByKey } from "../api/jiraApi";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import { ArrowLeft, Bug, CheckCircle2, Clock, AlertCircle, FolderKanban, User, Calendar, Grid3x3, List, Bot } from "lucide-react";
export default function ProjectIssues() {
    const { projectKey } = useParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('board');
    // Store project data in state
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    // Fetch issues for this project
    const { data: issues, loading: issuesLoading, error: issuesError } = useFetch(() => projectKey ? fetchIssuesByProject(projectKey) : Promise.resolve([]));
    // Group issues by status
    const groupIssuesByStatus = () => {
        if (!issues)
            return {};
        const grouped = {};
        issues.forEach((issue) => {
            const status = issue.fields?.status?.name || 'Unknown';
            if (!grouped[status]) {
                grouped[status] = [];
            }
            grouped[status].push(issue);
        });
        return grouped;
    };
    const groupedIssues = groupIssuesByStatus();
    // Define status order and colors
    const statusConfig = {
        'To Do': {
            label: 'To Do',
            color: 'text-gray-700',
            bgColor: 'bg-gray-100',
            icon: _jsx(AlertCircle, { className: "w-4 h-4 text-gray-500" })
        },
        'In Progress': {
            label: 'In Progress',
            color: 'text-blue-700',
            bgColor: 'bg-blue-100',
            icon: _jsx(Clock, { className: "w-4 h-4 text-blue-500" })
        },
        'Done': {
            label: 'Done',
            color: 'text-green-700',
            bgColor: 'bg-green-100',
            icon: _jsx(CheckCircle2, { className: "w-4 h-4 text-green-500" })
        },
        'Backlog': {
            label: 'Backlog',
            color: 'text-yellow-700',
            bgColor: 'bg-yellow-100',
            icon: _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-500" })
        }
    };
    // Get all unique statuses and sort them
    const getStatuses = () => {
        const statuses = Object.keys(groupedIssues);
        const orderedStatuses = ['To Do', 'In Progress', 'Done', 'Backlog'];
        const otherStatuses = statuses.filter(s => !orderedStatuses.includes(s));
        return [...orderedStatuses.filter(s => statuses.includes(s)), ...otherStatuses];
    };
    // Fetch project details using projectKey
    useEffect(() => {
        const loadProject = async () => {
            if (projectKey) {
                setProjectLoading(true);
                const projectData = await fetchProjectByKey(projectKey);
                setProject(projectData);
                setProjectLoading(false);
            }
        };
        loadProject();
    }, [projectKey]);
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80" }), _jsx("div", { className: "absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" }), _jsx("div", { className: "absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400/20 via-cyan-400/20 to-teal-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("button", { onClick: () => navigate("/"), className: "flex items-center space-x-2 text-gray-600 hover:text-indigo-700 transition-colors group", children: [_jsx(ArrowLeft, { className: "w-5 h-5 group-hover:-translate-x-1 transition-transform" }), _jsx("span", { className: "font-semibold", children: "Back to Projects" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: () => navigate(`/project/${projectKey}/genai`), className: "flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all", children: [_jsx(Bot, { className: "w-5 h-5" }), _jsx("span", { children: "GenAI Assistant" })] }), _jsxs("button", { onClick: () => navigate(`/project/${projectKey}/milestones`), className: "flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all", children: [_jsx(Calendar, { className: "w-5 h-5" }), _jsx("span", { children: "View Milestones" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" }), _jsx("div", { className: "relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl", children: _jsx(FolderKanban, { className: "w-9 h-9 text-white" }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h1", { className: "text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent", children: projectLoading ? "Loading..." : (project?.name || projectKey || "Project") }), projectKey && (_jsx("span", { className: "px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-md", children: projectKey }))] }), _jsx("p", { className: "text-lg text-gray-600 font-medium", children: "Project Issues" })] })] }), issues && issues.length > 0 && (_jsx("div", { className: "flex items-center space-x-4", children: _jsxs("div", { className: "px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-md", children: [_jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Total Issues" }), _jsx("p", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: issues.length })] }) }))] }), (issuesLoading || projectLoading) && (_jsxs("div", { className: "flex flex-col justify-center items-center py-32", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" }), _jsx("div", { className: "relative", children: _jsx(Loader, {}) })] }), _jsx("p", { className: "mt-6 text-lg font-semibold text-gray-600", children: "Loading project and issues..." })] })), issuesError && (_jsx("div", { className: "py-12", children: _jsx(Error, { message: issuesError }) })), _jsx("div", { className: "mb-6 flex items-center justify-end", children: _jsxs("div", { className: "flex items-center space-x-2 bg-white rounded-lg p-1 shadow-md border border-gray-200", children: [_jsx("button", { onClick: () => setViewMode('board'), className: `p-2 rounded-md transition-colors ${viewMode === 'board'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'}`, title: "Board View", children: _jsx(Grid3x3, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => setViewMode('grid'), className: `p-2 rounded-md transition-colors ${viewMode === 'grid'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'}`, title: "Grid View", children: _jsx(List, { className: "w-5 h-5" }) })] }) }), !issuesLoading && !projectLoading && !issuesError && (_jsx(_Fragment, { children: issues && issues.length > 0 ? (viewMode === 'board' ? (
                        // Board View (JIRA-like Kanban)
                        _jsx("div", { className: "flex gap-4 overflow-x-auto pb-4", children: getStatuses().map((status) => {
                                const statusIssues = groupedIssues[status] || [];
                                const config = statusConfig[status] || {
                                    label: status,
                                    color: 'text-gray-700',
                                    bgColor: 'bg-gray-100',
                                    icon: _jsx(AlertCircle, { className: "w-4 h-4 text-gray-500" })
                                };
                                return (_jsxs("div", { className: "flex-shrink-0 w-80", children: [_jsx("div", { className: `${config.bgColor} rounded-t-lg px-4 py-3 border-b-2 border-gray-200`, children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-2", children: [config.icon, _jsx("h3", { className: `font-bold text-sm ${config.color}`, children: config.label }), _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${config.color} bg-white/50`, children: statusIssues.length })] }) }) }), _jsxs("div", { className: "bg-gray-50 rounded-b-lg p-3 min-h-[400px] space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto", children: [statusIssues.map((issue, index) => (_jsx(IssueCard, { issue: issue, index: index }, issue.id))), statusIssues.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-400 text-sm", children: "No issues in this status" }))] })] }, status));
                            }) })) : (
                        // Grid View
                        _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '1.5rem'
                            }, children: issues.map((issue, index) => (_jsx(IssueCard, { issue: issue, index: index }, issue.id))) }))) : (_jsxs("div", { className: "text-center py-32", children: [_jsxs("div", { className: "relative inline-block mb-6", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30" }), _jsx("div", { className: "relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200", children: _jsx(Bug, { className: "w-12 h-12 text-indigo-500" }) })] }), _jsx("h3", { className: "text-3xl font-bold text-gray-900 mb-3", children: "No issues found" }), _jsx("p", { className: "text-lg text-gray-600 max-w-md mx-auto", children: "There are no issues available for this project at the moment." })] })) }))] })] }));
}
// Issue Card Component (reusable for both board and grid views)
function IssueCard({ issue, index }) {
    return (_jsxs("div", { className: "group bg-white rounded-lg border-2 border-gray-200/60 p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/60 flex flex-col cursor-pointer", style: {
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both',
        }, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm", children: _jsx(Bug, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { className: `flex items-center space-x-1.5 px-2.5 py-1 rounded-md border ${getStatusColor(issue.fields?.status?.name)} shadow-sm`, children: [getStatusIcon(issue.fields?.status?.name), _jsx("span", { className: "text-xs font-semibold", children: issue.fields?.status?.name || 'Unknown' })] })] }), _jsx("h3", { className: "text-base font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1", children: issue.fields?.summary || 'No summary' }), _jsx("div", { className: "mb-3", children: _jsx("span", { className: "text-xs font-semibold text-gray-500", children: issue.key }) }), issue.fields?.assignee && issue.fields.assignee.displayName ? (_jsx("div", { className: "mt-auto pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm", children: _jsx(User, { className: "w-3.5 h-3.5 text-white" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Assigned to" }), _jsx("p", { className: "text-xs font-bold text-gray-900 truncate", children: issue.fields.assignee.displayName })] })] }) })) : (_jsx("div", { className: "mt-auto pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center space-x-2 text-gray-400", children: [_jsx(User, { className: "w-3.5 h-3.5" }), _jsx("span", { className: "text-xs font-medium", children: "Unassigned" })] }) }))] }));
}
// Helper functions for status (moved outside component)
function getStatusColor(status) {
    if (!status)
        return "bg-gray-50 text-gray-700 border-gray-200";
    const statusLower = status.toLowerCase();
    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('resolved')) {
        return "bg-green-50 text-green-700 border-green-200";
    }
    else if (statusLower.includes('progress') || statusLower.includes('in progress')) {
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
    else if (statusLower.includes('block') || statusLower.includes('backlog')) {
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
    return "bg-gray-50 text-gray-700 border-gray-200";
}
function getStatusIcon(status) {
    if (!status)
        return _jsx(Bug, { className: "w-4 h-4 text-gray-500" });
    const statusLower = status.toLowerCase();
    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('resolved')) {
        return _jsx(CheckCircle2, { className: "w-4 h-4 text-green-500" });
    }
    else if (statusLower.includes('progress') || statusLower.includes('in progress')) {
        return _jsx(Clock, { className: "w-4 h-4 text-blue-500" });
    }
    else if (statusLower.includes('block') || statusLower.includes('backlog')) {
        return _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-500" });
    }
    return _jsx(Bug, { className: "w-4 h-4 text-gray-500" });
}
