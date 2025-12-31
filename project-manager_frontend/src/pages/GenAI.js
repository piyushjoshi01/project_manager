import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { syncProjectIssues, getAllLLMData, getProjectLLMData, updateAssigneeCost, recalculatePerformance, askLLM } from "../api/genaiApi";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import { ArrowLeft, Bot, RefreshCw, DollarSign, TrendingUp, Users, FileText, Sparkles, Send, MessageSquare } from "lucide-react";
export default function GenAI() {
    const { projectKey } = useParams();
    const navigate = useNavigate();
    const [llmData, setLlmData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const [hourlyCost, setHourlyCost] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isAsking, setIsAsking] = useState(false);
    useEffect(() => {
        loadLLMData();
    }, [projectKey]);
    const loadLLMData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = projectKey
                ? await getProjectLLMData(projectKey)
                : await getAllLLMData();
            setLlmData(data);
        }
        catch (err) {
            setError(err.message || 'Failed to load LLM data');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSync = async () => {
        if (!projectKey) {
            setError('Project key is required to sync issues');
            return;
        }
        try {
            setSyncing(true);
            setError(null);
            await syncProjectIssues(projectKey);
            await loadLLMData();
        }
        catch (err) {
            setError(err.message || 'Failed to sync issues');
        }
        finally {
            setSyncing(false);
        }
    };
    const handleRecalculate = async () => {
        try {
            setSyncing(true);
            setError(null);
            await recalculatePerformance();
            await loadLLMData();
        }
        catch (err) {
            setError(err.message || 'Failed to recalculate performance');
        }
        finally {
            setSyncing(false);
        }
    };
    const handleUpdateCost = async () => {
        if (!selectedAssignee || !hourlyCost) {
            setError('Please select an assignee and enter hourly cost');
            return;
        }
        try {
            setSyncing(true);
            setError(null);
            await updateAssigneeCost(selectedAssignee, parseFloat(hourlyCost));
            setSelectedAssignee(null);
            setHourlyCost("");
            await loadLLMData();
        }
        catch (err) {
            setError(err.message || 'Failed to update assignee cost');
        }
        finally {
            setSyncing(false);
        }
    };
    const handleAskQuestion = async () => {
        if (!userInput.trim())
            return;
        const question = userInput.trim();
        setUserInput("");
        setChatMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsAsking(true);
        setError(null);
        try {
            const response = await askLLM(question, projectKey || undefined);
            setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }
        catch (err) {
            setError(err.message || 'Failed to get response from LLM');
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        finally {
            setIsAsking(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAskQuestion();
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader, {}) }));
    }
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-100/80 via-purple-100/60 to-pink-100/80" }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("button", { onClick: () => projectKey ? navigate(`/project/${projectKey}`) : navigate("/"), className: "flex items-center space-x-2 text-gray-600 hover:text-purple-700 mb-6 transition-colors group", children: [_jsx(ArrowLeft, { className: "w-5 h-5 group-hover:-translate-x-1 transition-transform" }), _jsx("span", { className: "font-semibold", children: "Back" })] }), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-xl opacity-50" }), _jsx("div", { className: "relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl", children: _jsx(Bot, { className: "w-9 h-9 text-white" }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2", children: "AI-Powered Assistant" }), _jsx("p", { className: "text-xl text-gray-700 font-semibold mb-1", children: "Intelligent Project Analytics" }), _jsx("p", { className: "text-base text-gray-600", children: projectKey ? `Analyzing Project: ${projectKey}` : 'Analyzing All Projects' })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [projectKey && (_jsxs("button", { onClick: handleSync, disabled: syncing, className: "flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-5 h-5 ${syncing ? 'animate-spin' : ''}` }), _jsx("span", { children: syncing ? 'Syncing...' : 'Sync Issues' })] })), _jsxs("button", { onClick: handleRecalculate, disabled: syncing, className: "flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50", children: [_jsx(TrendingUp, { className: `w-5 h-5 ${syncing ? 'animate-spin' : ''}` }), _jsx("span", { children: syncing ? 'Recalculating...' : 'Recalculate Metrics' })] })] })] })] }), error && _jsx(Error, { message: error }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx(MessageSquare, { className: "w-6 h-6 text-purple-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Ask Questions" })] }), _jsx("div", { className: "h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200", children: chatMessages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500", children: [_jsx(Bot, { className: "w-12 h-12 mb-3 text-gray-400" }), _jsx("p", { className: "text-lg font-medium", children: "Ask me anything about your project!" }), _jsx("p", { className: "text-sm mt-2", children: "Try: \"What are the most expensive issues?\" or \"Who is the most efficient assignee?\"" })] })) : (_jsxs("div", { className: "space-y-4", children: [chatMessages.map((message, index) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-3xl rounded-lg p-4 ${message.role === 'user'
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                    : 'bg-gray-200 text-gray-900'}`, children: _jsxs("div", { className: "flex items-start space-x-2", children: [message.role === 'assistant' && (_jsx(Bot, { className: "w-5 h-5 mt-0.5 flex-shrink-0" })), _jsx("p", { className: "whitespace-pre-wrap", children: message.content })] }) }) }, index))), isAsking && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Bot, { className: "w-5 h-5" }), _jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "w-2 h-2 bg-gray-500 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-gray-500 rounded-full animate-bounce", style: { animationDelay: '0.1s' } }), _jsx("div", { className: "w-2 h-2 bg-gray-500 rounded-full animate-bounce", style: { animationDelay: '0.2s' } })] })] }) }) }))] })) }), _jsxs("div", { className: "flex items-end space-x-2", children: [_jsx("textarea", { value: userInput, onChange: (e) => setUserInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Ask a question about your project data...", className: "flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none", rows: 3, disabled: isAsking }), _jsxs("button", { onClick: handleAskQuestion, disabled: isAsking || !userInput.trim(), className: "px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2", children: [_jsx(Send, { className: "w-5 h-5" }), _jsx("span", { children: isAsking ? 'Sending...' : 'Send' })] })] })] }), llmData && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsx("div", { className: "bg-white rounded-xl p-6 shadow-lg border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Total Issues" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: llmData.issues.length })] }), _jsx(FileText, { className: "w-8 h-8 text-purple-500" })] }) }), _jsx("div", { className: "bg-white rounded-xl p-6 shadow-lg border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Assignees" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: llmData.assignees.length })] }), _jsx(Users, { className: "w-8 h-8 text-pink-500" })] }) }), _jsx("div", { className: "bg-white rounded-xl p-6 shadow-lg border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Total Cost" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: ["$", llmData.issues.reduce((sum, issue) => sum + (issue.totalCost || 0), 0).toFixed(2)] })] }), _jsx(DollarSign, { className: "w-8 h-8 text-green-500" })] }) }), _jsx("div", { className: "bg-white rounded-xl p-6 shadow-lg border border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Avg Efficiency" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: llmData.issues.length > 0
                                                        ? (llmData.issues.reduce((sum, issue) => sum + (issue.efficiencyScore || 0), 0) / llmData.issues.length).toFixed(1)
                                                        : '0.0' })] }), _jsx(Sparkles, { className: "w-8 h-8 text-yellow-500" })] }) })] })), llmData && llmData.assignees.length > 0 && (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Assignee Performance" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-purple-50 to-pink-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Issues Completed" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Avg Time (hrs)" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Efficiency Score" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Hourly Cost" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Total Cost" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: llmData.assignees.map((assignee) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: assignee.name }), _jsx("div", { className: "text-xs text-gray-500", children: assignee.email })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: assignee.totalIssuesCompleted }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: assignee.averageTimeHours?.toFixed(2) || '0.00' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: assignee.averageEfficiencyScore?.toFixed(2) || '0.00' }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: ["$", assignee.hourlyCost?.toFixed(2) || '0.00'] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900", children: ["$", assignee.totalCostIncurred?.toFixed(2) || '0.00'] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("button", { onClick: () => {
                                                                setSelectedAssignee(assignee.accountId);
                                                                setHourlyCost(assignee.hourlyCost?.toString() || "");
                                                            }, className: "text-purple-600 hover:text-purple-800 text-sm font-medium", children: "Edit Cost" }) })] }, assignee.accountId))) })] }) })] })), selectedAssignee && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "Update Hourly Cost" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Hourly Cost ($)" }), _jsx("input", { type: "number", step: "0.01", value: hourlyCost, onChange: (e) => setHourlyCost(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500", placeholder: "Enter hourly cost" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: handleUpdateCost, disabled: syncing || !hourlyCost, className: "flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50", children: syncing ? 'Updating...' : 'Update' }), _jsx("button", { onClick: () => {
                                                setSelectedAssignee(null);
                                                setHourlyCost("");
                                            }, className: "flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300", children: "Cancel" })] })] }) })), llmData && llmData.issues.length > 0 && (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Issue Analysis" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-purple-50 to-pink-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Issue Key" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Summary" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Assignee" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Time (hrs)" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Cost" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase", children: "Efficiency" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: llmData.issues.map((issue) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: issue.issueKey }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600 max-w-xs truncate", children: issue.summary }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: issue.assigneeName || 'Unassigned' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: issue.status }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: issue.timeTakenHours?.toFixed(2) || '0.00' }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900", children: ["$", issue.totalCost?.toFixed(2) || '0.00'] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: issue.efficiencyScore?.toFixed(2) || '0.00' })] }, issue.issueKey))) })] }) })] })), llmData && llmData.issues.length === 0 && llmData.assignees.length === 0 && (_jsxs("div", { className: "text-center py-32", children: [_jsx(Bot, { className: "w-24 h-24 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-3xl font-bold text-gray-900 mb-3", children: "No Data Available" }), _jsx("p", { className: "text-lg text-gray-600 max-w-md mx-auto mb-6", children: projectKey
                                    ? 'Sync issues from Jira to start analyzing project data.'
                                    : 'No LLM data available. Sync issues for a project to get started.' }), projectKey && (_jsx("button", { onClick: handleSync, disabled: syncing, className: "px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50", children: syncing ? 'Syncing...' : 'Sync Issues' }))] }))] })] }));
}
