import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../api/jiraApi";
import { getAllLLMData } from "../api/genaiApi";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import { BarChart3, TrendingUp, DollarSign, Users, Target, Clock, CheckCircle2, ArrowRight, FolderKanban, Zap, Activity, PieChart, LineChart } from "lucide-react";
export default function Analytics() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [llmData, setLlmData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState("all");
    useEffect(() => {
        loadAnalyticsData();
    }, []);
    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch both projects and LLM data in parallel to minimize API calls
            const [projectsData, llmDataResponse] = await Promise.all([
                fetchProjects(),
                getAllLLMData()
            ]);
            setProjects(projectsData);
            setLlmData(llmDataResponse);
        }
        catch (err) {
            setError(err.message || 'Failed to load analytics data');
        }
        finally {
            setLoading(false);
        }
    };
    // Filter data based on selected project
    const filteredData = useMemo(() => {
        if (!llmData)
            return null;
        if (selectedProject === "all") {
            return llmData;
        }
        return {
            issues: llmData.issues.filter(issue => issue.projectKey === selectedProject),
            assignees: llmData.assignees // Assignees are shared across projects
        };
    }, [llmData, selectedProject]);
    // Calculate statistics
    const stats = useMemo(() => {
        if (!filteredData)
            return null;
        const issues = filteredData.issues;
        const assignees = filteredData.assignees;
        const totalIssues = issues.length;
        const completedIssues = issues.filter(i => i.status?.toLowerCase().includes('done') ||
            i.status?.toLowerCase().includes('complete')).length;
        const inProgressIssues = issues.filter(i => i.status?.toLowerCase().includes('progress')).length;
        const totalCost = issues.reduce((sum, issue) => sum + (issue.totalCost || 0), 0);
        const avgEfficiency = issues.length > 0
            ? issues.reduce((sum, issue) => sum + (issue.efficiencyScore || 0), 0) / issues.length
            : 0;
        const avgTimePerIssue = issues.length > 0
            ? issues.reduce((sum, issue) => sum + (issue.timeTakenHours || 0), 0) / issues.length
            : 0;
        const totalTeamMembers = assignees.length;
        const totalCostIncurred = assignees.reduce((sum, assignee) => sum + (assignee.totalCostIncurred || 0), 0);
        // Project breakdown
        const projectBreakdown = issues.reduce((acc, issue) => {
            const key = issue.projectKey;
            if (!acc[key]) {
                acc[key] = { count: 0, cost: 0, completed: 0 };
            }
            acc[key].count++;
            acc[key].cost += issue.totalCost || 0;
            if (issue.status?.toLowerCase().includes('done') || issue.status?.toLowerCase().includes('complete')) {
                acc[key].completed++;
            }
            return acc;
        }, {});
        // Status breakdown
        const statusBreakdown = issues.reduce((acc, issue) => {
            const status = issue.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        // Top performers
        const topPerformers = [...assignees]
            .sort((a, b) => (b.averageEfficiencyScore || 0) - (a.averageEfficiencyScore || 0))
            .slice(0, 5);
        return {
            totalIssues,
            completedIssues,
            inProgressIssues,
            totalCost,
            avgEfficiency,
            avgTimePerIssue,
            totalTeamMembers,
            totalCostIncurred,
            projectBreakdown,
            statusBreakdown,
            topPerformers,
            completionRate: totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0
        };
    }, [filteredData]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader, {}) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Error, { message: error }) }));
    }
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80" }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" }), _jsx("div", { className: "relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl", children: _jsx(BarChart3, { className: "w-9 h-9 text-white" }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2", children: "Analytics Dashboard" }), _jsx("p", { className: "text-lg text-gray-600 font-medium", children: "Comprehensive insights into your projects and team performance" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Project:" }), _jsxs("select", { value: selectedProject, onChange: (e) => setSelectedProject(e.target.value), className: "px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-gray-700 cursor-pointer", children: [_jsx("option", { value: "all", children: "All Projects" }), projects.map((project) => (_jsxs("option", { value: project.key, children: [project.name, " (", project.key, ")"] }, project.id)))] })] })] }) }), stats && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg", children: _jsx(Target, { className: "w-6 h-6 text-white" }) }), _jsx(TrendingUp, { className: "w-5 h-5 text-green-500" })] }), _jsx("p", { className: "text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: stats.totalIssues }), _jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wider", children: "Total Issues" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [stats.completedIssues, " completed (", stats.completionRate.toFixed(1), "%)"] })] })] }), _jsxs("div", { className: "group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-full" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg", children: _jsx(DollarSign, { className: "w-6 h-6 text-white" }) }), _jsx(Activity, { className: "w-5 h-5 text-blue-500" })] }), _jsxs("p", { className: "text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1", children: ["$", stats.totalCost.toFixed(2)] }), _jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wider", children: "Total Cost" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["$", stats.totalCostIncurred.toFixed(2), " by team"] })] })] }), _jsxs("div", { className: "group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-emerald-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg", children: _jsx(Zap, { className: "w-6 h-6 text-white" }) }), _jsx(CheckCircle2, { className: "w-5 h-5 text-green-500" })] }), _jsx("p", { className: "text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1", children: stats.avgEfficiency.toFixed(1) }), _jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wider", children: "Avg Efficiency" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [stats.avgTimePerIssue.toFixed(1), " hrs per issue"] })] })] }), _jsxs("div", { className: "group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg", children: _jsx(Users, { className: "w-6 h-6 text-white" }) }), _jsx(Clock, { className: "w-5 h-5 text-purple-500" })] }), _jsx("p", { className: "text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1", children: stats.totalTeamMembers }), _jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wider", children: "Team Members" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [stats.inProgressIssues, " issues in progress"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("h3", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(PieChart, { className: "w-6 h-6 text-indigo-600" }), "Project Breakdown"] }) }), _jsx("div", { className: "space-y-4", children: Object.entries(stats.projectBreakdown).map(([projectKey, data]) => {
                                                    const project = projects.find(p => p.key === projectKey);
                                                    const percentage = stats.totalIssues > 0
                                                        ? (data.count / stats.totalIssues) * 100
                                                        : 0;
                                                    return (_jsxs("div", { className: "group cursor-pointer", onClick: () => navigate(`/project/${projectKey}`), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FolderKanban, { className: "w-4 h-4 text-indigo-600" }), _jsx("span", { className: "font-semibold text-gray-900", children: project?.name || projectKey }), _jsxs("span", { className: "text-xs text-gray-500", children: ["(", projectKey, ")"] })] }), _jsxs("span", { className: "text-sm font-bold text-gray-700", children: [data.count, " issues"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 group-hover:opacity-80", style: { width: `${percentage}%` } }) }), _jsxs("div", { className: "flex items-center justify-between mt-1 text-xs text-gray-600", children: [_jsxs("span", { children: [data.completed, " completed"] }), _jsxs("span", { children: ["$", data.cost.toFixed(2)] })] })] }, projectKey));
                                                }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("h3", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-6 h-6 text-blue-600" }), "Status Distribution"] }) }), _jsx("div", { className: "space-y-4", children: Object.entries(stats.statusBreakdown)
                                                    .sort(([, a], [, b]) => b - a)
                                                    .map(([status, count]) => {
                                                    const percentage = stats.totalIssues > 0
                                                        ? (count / stats.totalIssues) * 100
                                                        : 0;
                                                    const getStatusColor = (status) => {
                                                        const lower = status.toLowerCase();
                                                        if (lower.includes('done') || lower.includes('complete'))
                                                            return 'from-green-500 to-emerald-600';
                                                        if (lower.includes('progress'))
                                                            return 'from-blue-500 to-cyan-600';
                                                        if (lower.includes('todo') || lower.includes('backlog'))
                                                            return 'from-gray-500 to-slate-600';
                                                        return 'from-yellow-500 to-orange-600';
                                                    };
                                                    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-semibold text-gray-900", children: status }), _jsxs("span", { className: "text-sm font-bold text-gray-700", children: [count, " (", percentage.toFixed(1), "%)"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: `h-full bg-gradient-to-r ${getStatusColor(status)} transition-all duration-500`, style: { width: `${percentage}%` } }) })] }, status));
                                                }) })] })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50 mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-6 h-6 text-emerald-600" }), "Top Performers"] }), _jsxs("button", { onClick: () => navigate("/genai"), className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all", children: ["View Details", _jsx(ArrowRight, { className: "w-4 h-4" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: stats.topPerformers.map((assignee, index) => (_jsxs("div", { className: "p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-indigo-300 transition-all", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold", children: index + 1 }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: assignee.name }), _jsx("p", { className: "text-xs text-gray-500", children: assignee.email })] })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Efficiency" }), _jsx("p", { className: "font-bold text-emerald-600", children: assignee.averageEfficiencyScore?.toFixed(1) || '0.0' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Issues" }), _jsx("p", { className: "font-bold text-indigo-600", children: assignee.totalIssuesCompleted })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Avg Time" }), _jsxs("p", { className: "font-bold text-blue-600", children: [assignee.averageTimeHours?.toFixed(1) || '0.0', "h"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Cost" }), _jsxs("p", { className: "font-bold text-purple-600", children: ["$", assignee.totalCostIncurred?.toFixed(0) || '0'] })] })] })] }, assignee.accountId))) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50", children: [_jsxs("h3", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6", children: [_jsx(LineChart, { className: "w-6 h-6 text-purple-600" }), "Cost Analysis"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200", children: [_jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase mb-2", children: "Total Project Cost" }), _jsxs("p", { className: "text-3xl font-extrabold text-blue-600", children: ["$", stats.totalCost.toFixed(2)] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Across all issues" })] }), _jsxs("div", { className: "text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200", children: [_jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase mb-2", children: "Team Cost" }), _jsxs("p", { className: "text-3xl font-extrabold text-purple-600", children: ["$", stats.totalCostIncurred.toFixed(2)] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "By assignees" })] }), _jsxs("div", { className: "text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200", children: [_jsx("p", { className: "text-sm font-semibold text-gray-600 uppercase mb-2", children: "Avg Cost/Issue" }), _jsxs("p", { className: "text-3xl font-extrabold text-emerald-600", children: ["$", stats.totalIssues > 0 ? (stats.totalCost / stats.totalIssues).toFixed(2) : '0.00'] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Per issue average" })] })] })] })] })), stats && stats.totalIssues === 0 && (_jsxs("div", { className: "text-center py-32 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50", children: [_jsx(BarChart3, { className: "w-24 h-24 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-3xl font-bold text-gray-900 mb-3", children: "No Data Available" }), _jsx("p", { className: "text-lg text-gray-600 max-w-md mx-auto mb-6", children: selectedProject === "all"
                                    ? "Sync issues from your projects to see analytics. Visit the GenAI page to sync data."
                                    : "No issues found for this project. Sync issues to see analytics." }), _jsx("button", { onClick: () => navigate("/genai"), className: "px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", children: "Sync Project Data" })] }))] })] }));
}
