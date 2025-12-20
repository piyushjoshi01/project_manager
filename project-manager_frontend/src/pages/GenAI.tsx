import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  syncProjectIssues, 
  getAllLLMData, 
  getProjectLLMData, 
  updateAssigneeCost, 
  recalculatePerformance,
  askLLM
} from "../api/genaiApi";
import { LLMData, IssueAnalysis, AssigneePerformance } from "../types/llm.types";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import { ArrowLeft, Bot, RefreshCw, DollarSign, TrendingUp, Users, FileText, Sparkles, Send, MessageSquare } from "lucide-react";

export default function GenAI() {
  const { projectKey } = useParams<{ projectKey?: string }>();
  const navigate = useNavigate();
  const [llmData, setLlmData] = useState<LLMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [hourlyCost, setHourlyCost] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [userInput, setUserInput] = useState<string>("");
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
    } catch (err: any) {
      setError(err.message || 'Failed to load LLM data');
    } finally {
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
    } catch (err: any) {
      setError(err.message || 'Failed to sync issues');
    } finally {
      setSyncing(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setSyncing(true);
      setError(null);
      await recalculatePerformance();
      await loadLLMData();
    } catch (err: any) {
      setError(err.message || 'Failed to recalculate performance');
    } finally {
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
    } catch (err: any) {
      setError(err.message || 'Failed to update assignee cost');
    } finally {
      setSyncing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!userInput.trim()) return;
    
    const question = userInput.trim();
    setUserInput("");
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsAsking(true);
    setError(null);

    try {
      const response = await askLLM(question, projectKey || undefined);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response from LLM');
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-purple-100/60 to-pink-100/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => projectKey ? navigate(`/project/${projectKey}`) : navigate("/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl">
                  <Bot className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                  AI-Powered Assistant
                </h1>
                <p className="text-xl text-gray-700 font-semibold mb-1">
                  Intelligent Project Analytics
                </p>
                <p className="text-base text-gray-600">
                  {projectKey ? `Analyzing Project: ${projectKey}` : 'Analyzing All Projects'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {projectKey && (
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Issues'}</span>
                </button>
              )}
              <button
                onClick={handleRecalculate}
                disabled={syncing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <TrendingUp className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Recalculating...' : 'Recalculate Metrics'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <Error message={error} />}

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Ask Questions</h2>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bot className="w-12 h-12 mb-3 text-gray-400" />
                <p className="text-lg font-medium">Ask me anything about your project!</p>
                <p className="text-sm mt-2">Try: "What are the most expensive issues?" or "Who is the most efficient assignee?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isAsking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-end space-x-2">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your project data..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              rows={3}
              disabled={isAsking}
            />
            <button
              onClick={handleAskQuestion}
              disabled={isAsking || !userInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isAsking ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {llmData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{llmData.issues.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignees</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{llmData.assignees.length}</p>
                </div>
                <Users className="w-8 h-8 text-pink-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${llmData.issues.reduce((sum, issue) => sum + (issue.totalCost || 0), 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {llmData.issues.length > 0
                      ? (llmData.issues.reduce((sum, issue) => sum + (issue.efficiencyScore || 0), 0) / llmData.issues.length).toFixed(1)
                      : '0.0'}
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Assignee Performance Section */}
        {llmData && llmData.assignees.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assignee Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Issues Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Avg Time (hrs)</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Efficiency Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hourly Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {llmData.assignees.map((assignee) => (
                    <tr key={assignee.accountId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignee.name}</div>
                        <div className="text-xs text-gray-500">{assignee.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assignee.totalIssuesCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assignee.averageTimeHours?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assignee.averageEfficiencyScore?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${assignee.hourlyCost?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${assignee.totalCostIncurred?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedAssignee(assignee.accountId);
                            setHourlyCost(assignee.hourlyCost?.toString() || "");
                          }}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Edit Cost
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Update Cost Modal */}
        {selectedAssignee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Update Hourly Cost</h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hourly Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter hourly cost"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleUpdateCost}
                  disabled={syncing || !hourlyCost}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {syncing ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => {
                    setSelectedAssignee(null);
                    setHourlyCost("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issues Analysis Section */}
        {llmData && llmData.issues.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Issue Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Issue Key</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Summary</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assignee</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time (hrs)</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {llmData.issues.map((issue) => (
                    <tr key={issue.issueKey} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {issue.issueKey}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {issue.summary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {issue.assigneeName || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {issue.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {issue.timeTakenHours?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${issue.totalCost?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {issue.efficiencyScore?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {llmData && llmData.issues.length === 0 && llmData.assignees.length === 0 && (
          <div className="text-center py-32">
            <Bot className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Data Available</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              {projectKey 
                ? 'Sync issues from Jira to start analyzing project data.'
                : 'No LLM data available. Sync issues for a project to get started.'}
            </p>
            {projectKey && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {syncing ? 'Syncing...' : 'Sync Issues'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

