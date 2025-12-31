import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMilestones, createMilestone, updateMilestone, deleteMilestone } from "../api/milestoneApi";
import { fetchIssuesByProject } from "../api/jiraApi";
import { ArrowLeft, Plus, Edit2, Trash2, Table, Calendar, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
export default function Milestones() {
    const { projectKey } = useParams();
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: ''
    });
    // Fetch milestones
    useEffect(() => {
        loadMilestones();
    }, [projectKey]);
    const loadMilestones = async () => {
        if (!projectKey) {
            setError('Project key is required');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await fetchMilestones(projectKey);
            setMilestones(data);
            setError(null);
        }
        catch (err) {
            setError(err.message || 'Failed to load milestones');
        }
        finally {
            setLoading(false);
        }
    };
    // Calculate milestone status based on issues
    const calculateStatus = async (milestone) => {
        if (!projectKey) {
            return { totalIssues: 0, toDo: 0, backlog: 0, completed: 0, inProgress: 0, status: 'on-track', progress: 0 };
        }
        try {
            const issues = await fetchIssuesByProject(projectKey);
            const now = new Date();
            const startDate = new Date(milestone.startDate);
            const endDate = new Date(milestone.endDate);
            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
                return { totalIssues: 0, toDo: 0, backlog: 0, completed: 0, inProgress: 0, status: 'on-track', progress: 0 };
            }
            const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            const elapsedDays = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const expectedProgress = totalDays > 0
                ? Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
                : 0;
            const statusCounts = {
                toDo: 0,
                backlog: 0,
                completed: 0,
                inProgress: 0,
                total: issues.length
            };
            issues.forEach((issue) => {
                const status = issue.fields?.status?.name?.toLowerCase() || '';
                if (status.includes('done') || status.includes('complete') || status.includes('resolved')) {
                    statusCounts.completed++;
                }
                else if (status.includes('progress') || status.includes('in progress')) {
                    statusCounts.inProgress++;
                }
                else if (status.includes('backlog')) {
                    statusCounts.backlog++;
                }
                else {
                    statusCounts.toDo++;
                }
            });
            const actualProgress = statusCounts.total > 0
                ? (statusCounts.completed / statusCounts.total) * 100
                : 0;
            const progressDiff = expectedProgress - actualProgress;
            const remainingTasks = statusCounts.toDo + statusCounts.backlog + statusCounts.inProgress;
            let status = 'on-track';
            // Status calculation logic
            if (elapsedDays > totalDays && actualProgress < 100) {
                status = 'delayed';
            }
            else if (progressDiff > 20) {
                status = 'delayed';
            }
            else if (progressDiff > 10 || remainingTasks > statusCounts.completed) {
                status = 'at-risk';
            }
            else {
                status = 'on-track';
            }
            return {
                totalIssues: statusCounts.total,
                toDo: statusCounts.toDo,
                backlog: statusCounts.backlog,
                completed: statusCounts.completed,
                inProgress: statusCounts.inProgress,
                status,
                progress: actualProgress
            };
        }
        catch (err) {
            return { totalIssues: 0, toDo: 0, backlog: 0, completed: 0, inProgress: 0, status: 'on-track', progress: 0 };
        }
    };
    const handleCreate = async () => {
        if (!projectKey) {
            setError('Project key is required');
            return;
        }
        try {
            await createMilestone({ ...formData, projectKey });
            setIsCreating(false);
            setFormData({ name: '', startDate: '', endDate: '', description: '' });
            loadMilestones();
        }
        catch (err) {
            setError(err.message || 'Failed to create milestone');
        }
    };
    const handleUpdate = async (id) => {
        if (!projectKey) {
            setError('Project key is required');
            return;
        }
        try {
            await updateMilestone(id, { ...formData, projectKey });
            setEditingId(null);
            setFormData({ name: '', startDate: '', endDate: '', description: '' });
            loadMilestones();
        }
        catch (err) {
            setError(err.message || 'Failed to update milestone');
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this milestone?'))
            return;
        try {
            await deleteMilestone(id);
            loadMilestones();
        }
        catch (err) {
            setError(err.message || 'Failed to delete milestone');
        }
    };
    const startEdit = (milestone) => {
        setEditingId(milestone.id ? String(milestone.id) : null);
        setFormData({
            name: milestone.name,
            startDate: milestone.startDate,
            endDate: milestone.endDate,
            description: milestone.description
        });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'on-track':
                return 'bg-green-500';
            case 'at-risk':
                return 'bg-yellow-500';
            case 'delayed':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'on-track':
                return _jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" });
            case 'at-risk':
                return _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-600" });
            case 'delayed':
                return _jsx(XCircle, { className: "w-4 h-4 text-red-600" });
            default:
                return _jsx(AlertCircle, { className: "w-4 h-4 text-gray-600" });
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader, {}) }));
    }
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80" }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("button", { onClick: () => navigate(`/project/${projectKey}`), className: "flex items-center space-x-2 text-gray-600 hover:text-indigo-700 mb-6 transition-colors group", children: [_jsx(ArrowLeft, { className: "w-5 h-5 group-hover:-translate-x-1 transition-transform" }), _jsx("span", { className: "font-semibold", children: "Back to Issues" })] }), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2", children: "Project Milestones" }), _jsxs("p", { className: "text-lg text-gray-600 font-medium", children: ["Managing milestones for: ", _jsx("span", { className: "font-bold text-indigo-700", children: projectKey })] }), milestones.length > 0 && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [milestones.length, " milestone", milestones.length !== 1 ? 's' : '', " defined for this project"] }))] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2 bg-white rounded-lg p-1 shadow-md border border-gray-200", children: [_jsx("button", { onClick: () => setViewMode('table'), className: `p-2 rounded-md transition-colors ${viewMode === 'table'
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'}`, children: _jsx(Table, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => setViewMode('timeline'), className: `p-2 rounded-md transition-colors ${viewMode === 'timeline'
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'}`, children: _jsx(Calendar, { className: "w-5 h-5" }) })] }), _jsxs("button", { onClick: () => setIsCreating(true), className: "flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { children: "New Milestone" })] })] })] })] }), error && _jsx(Error, { message: error }), (isCreating || editingId) && (_jsxs("div", { className: "mb-6 bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-xl font-bold", children: [editingId ? 'Edit' : 'Create', " Milestone"] }), projectKey && (_jsxs("span", { className: "px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-semibold", children: ["Project: ", projectKey] }))] }), !projectKey && (_jsx("div", { className: "mb-4 p-3 rounded-lg bg-red-50 border border-red-200", children: _jsx("p", { className: "text-sm text-red-700", children: "Project key is required to create milestones. Please navigate to a project first." }) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "milestone-name", className: "block text-sm font-semibold text-gray-700 mb-2", children: ["Milestone Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { id: "milestone-name", type: "text", placeholder: "Enter milestone name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "start-date", className: "block text-sm font-semibold text-gray-700 mb-2", children: ["Start Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { id: "start-date", type: "date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "end-date", className: "block text-sm font-semibold text-gray-700 mb-2", children: ["End Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { id: "end-date", type: "date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-semibold text-gray-700 mb-2", children: "Description" }), _jsx("input", { id: "description", type: "text", placeholder: "Enter milestone description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" })] })] }), _jsxs("div", { className: "flex items-center space-x-2 mt-4", children: [_jsx("button", { onClick: () => editingId ? handleUpdate(editingId) : handleCreate(), className: "px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700", children: editingId ? 'Update' : 'Create' }), _jsx("button", { onClick: () => {
                                            setIsCreating(false);
                                            setEditingId(null);
                                            setFormData({ name: '', startDate: '', endDate: '', description: '' });
                                        }, className: "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300", children: "Cancel" })] })] })), viewMode === 'table' && (_jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-indigo-50 to-purple-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Name" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Start Date" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "End Date" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Description" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: milestones.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-12 text-center text-gray-500", children: "No milestones found. Create one to get started." }) })) : (milestones.map((milestone, index) => (_jsx(MilestoneRow, { milestone: milestone, onEdit: () => startEdit(milestone), onDelete: () => handleDelete(milestone.id ? String(milestone.id) : ''), calculateStatus: calculateStatus, getStatusColor: getStatusColor, getStatusIcon: getStatusIcon }, milestone.id || index)))) })] }) }) })), viewMode === 'timeline' && (_jsx(TimelineView, { milestones: milestones, calculateStatus: calculateStatus }))] })] }));
}
// Milestone Row Component with async status calculation
function MilestoneRow({ milestone, onEdit, onDelete, calculateStatus, getStatusColor, getStatusIcon }) {
    const [status, setStatus] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    useEffect(() => {
        calculateStatus(milestone).then((s) => {
            setStatus(s);
            setLoadingStatus(false);
        });
    }, [milestone]);
    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-semibold text-gray-900", children: milestone.name }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-600", children: new Date(milestone.startDate).toLocaleDateString() }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-600", children: new Date(milestone.endDate).toLocaleDateString() }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-600 max-w-xs truncate", children: milestone.description }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: loadingStatus ? (_jsx("div", { className: "w-24 h-2 bg-gray-200 rounded-full animate-pulse" })) : status ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "flex-1 bg-gray-200 rounded-full h-2 w-24", children: _jsx("div", { className: `h-2 rounded-full transition-all ${getStatusColor(status.status)}`, style: { width: `${status.progress}%` } }) }), getStatusIcon(status.status), _jsxs("span", { className: "text-xs font-medium text-gray-600", children: [status.progress.toFixed(0), "%"] })] })) : (_jsx("span", { className: "text-xs text-gray-400", children: "N/A" })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: onEdit, className: "p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: onDelete, className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }));
}
// Timeline View Component
function TimelineView({ milestones, calculateStatus }) {
    const [statuses, setStatuses] = useState(new Map());
    useEffect(() => {
        const loadStatuses = async () => {
            const statusMap = new Map();
            for (const milestone of milestones) {
                const status = await calculateStatus(milestone);
                const key = milestone.id ? String(milestone.id) : milestone.name;
                statusMap.set(key, status);
            }
            setStatuses(statusMap);
        };
        if (milestones.length > 0) {
            loadStatuses();
        }
    }, [milestones]);
    if (milestones.length === 0) {
        return (_jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center", children: _jsx("p", { className: "text-gray-500", children: "No milestones to display" }) }));
    }
    // Calculate timeline bounds
    const dates = milestones.flatMap(m => [
        new Date(m.startDate).getTime(),
        new Date(m.endDate).getTime()
    ]);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-xl font-bold mb-6", children: "Project Timeline" }), _jsx("div", { className: "space-y-6", children: milestones.map((milestone, index) => {
                    const key = milestone.id ? String(milestone.id) : milestone.name;
                    const status = statuses.get(key);
                    const startDate = new Date(milestone.startDate);
                    const endDate = new Date(milestone.endDate);
                    const left = ((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
                    const width = ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
                    return (_jsx("div", { className: "relative", children: _jsxs("div", { className: "flex items-center space-x-4 mb-2", children: [_jsxs("div", { className: "w-48 flex-shrink-0", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: milestone.name }), _jsx("p", { className: "text-sm text-gray-500", children: milestone.description })] }), _jsxs("div", { className: "flex-1 relative h-12 bg-gray-100 rounded-lg overflow-hidden", children: [_jsx("div", { className: `absolute h-full rounded-lg ${status?.status === 'on-track' ? 'bg-green-500' :
                                                status?.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'}`, style: {
                                                left: `${left}%`,
                                                width: `${width}%`,
                                                opacity: 0.7
                                            } }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-xs font-medium text-gray-700", children: [startDate.toLocaleDateString(), " - ", endDate.toLocaleDateString()] }) })] }), _jsx("div", { className: "w-24 flex-shrink-0 text-right", children: status && (_jsxs("div", { className: "flex items-center justify-end space-x-1", children: [status.status === 'on-track' && _jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }), status.status === 'at-risk' && _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-600" }), status.status === 'delayed' && _jsx(XCircle, { className: "w-4 h-4 text-red-600" }), _jsxs("span", { className: "text-xs font-medium text-gray-600", children: [status.progress.toFixed(0), "%"] })] })) })] }) }, milestone.id || index));
                }) }), _jsx("div", { className: "mt-8 pt-4 border-t border-gray-200", children: _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: minDate.toLocaleDateString() }), _jsx("span", { children: maxDate.toLocaleDateString() })] }) })] }));
}
