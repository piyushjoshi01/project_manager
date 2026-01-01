import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../api/jiraApi";
import { getAllLLMData } from "../api/genaiApi";
import { LLMData, IssueAnalysis, AssigneePerformance } from "../types/llm.types";
import { JiraProject } from "../types/jira.types";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import {
  BarChart3, TrendingUp, DollarSign, Users, Target, Clock, CheckCircle2,
  AlertCircle, ArrowRight, FolderKanban, Zap, Activity, PieChart, LineChart
} from "lucide-react";

export default function Analytics() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [llmData, setLlmData] = useState<LLMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("all");

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
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected project
  const filteredData = useMemo(() => {
    if (!llmData) return null;
    
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
    if (!filteredData) return null;

    const issues = filteredData.issues;
    const assignees = filteredData.assignees;

    const totalIssues = issues.length;
    const completedIssues = issues.filter(i => 
      i.status?.toLowerCase().includes('done') || 
      i.status?.toLowerCase().includes('complete')
    ).length;
    const inProgressIssues = issues.filter(i => 
      i.status?.toLowerCase().includes('progress')
    ).length;
    const totalCost = issues.reduce((sum, issue) => sum + (issue.totalCost || 0), 0);
    const avgEfficiency = issues.length > 0
      ? issues.reduce((sum, issue) => sum + (issue.efficiencyScore || 0), 0) / issues.length
      : 0;
    const avgTimePerIssue = issues.length > 0
      ? issues.reduce((sum, issue) => sum + (issue.timeTakenHours || 0), 0) / issues.length
      : 0;
    const totalTeamMembers = assignees.length;
    const totalCostIncurred = assignees.reduce((sum, assignee) => 
      sum + (assignee.totalCostIncurred || 0), 0
    );

    // Project breakdown
    const projectBreakdown = issues.reduce((acc: any, issue) => {
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
    const statusBreakdown = issues.reduce((acc: any, issue) => {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
                  <BarChart3 className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Comprehensive insights into your projects and team performance
                </p>
              </div>
            </div>

            {/* Project Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.key}>
                    {project.name} ({project.key})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {stats && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stats.totalIssues}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Issues</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.completedIssues} completed ({stats.completionRate.toFixed(1)}%)
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                    ${stats.totalCost.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Cost</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${stats.totalCostIncurred.toFixed(2)} by team
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-emerald-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                    {stats.avgEfficiency.toFixed(1)}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Avg Efficiency</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.avgTimePerIssue.toFixed(1)} hrs per issue
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    {stats.totalTeamMembers}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Team Members</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.inProgressIssues} issues in progress
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Project Breakdown */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="w-6 h-6 text-indigo-600" />
                    Project Breakdown
                  </h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.projectBreakdown).map(([projectKey, data]: [string, any]) => {
                    const project = projects.find(p => p.key === projectKey);
                    const percentage = stats.totalIssues > 0 
                      ? (data.count / stats.totalIssues) * 100 
                      : 0;
                    return (
                      <div key={projectKey} className="group cursor-pointer" onClick={() => navigate(`/project/${projectKey}`)}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-indigo-600" />
                            <span className="font-semibold text-gray-900">
                              {project?.name || projectKey}
                            </span>
                            <span className="text-xs text-gray-500">({projectKey})</span>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{data.count} issues</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 group-hover:opacity-80"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                          <span>{data.completed} completed</span>
                          <span>${data.cost.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Status Distribution
                  </h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.statusBreakdown)
                    .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                    .map(([status, count]: [string, any]) => {
                      const percentage = stats.totalIssues > 0 
                        ? (count / stats.totalIssues) * 100 
                        : 0;
                      const getStatusColor = (status: string) => {
                        const lower = status.toLowerCase();
                        if (lower.includes('done') || lower.includes('complete')) return 'from-green-500 to-emerald-600';
                        if (lower.includes('progress')) return 'from-blue-500 to-cyan-600';
                        if (lower.includes('todo') || lower.includes('backlog')) return 'from-gray-500 to-slate-600';
                        return 'from-yellow-500 to-orange-600';
                      };
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{status}</span>
                            <span className="text-sm font-bold text-gray-700">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getStatusColor(status)} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  Top Performers
                </h3>
                <button
                  onClick={() => navigate("/genai")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.topPerformers.map((assignee, index) => (
                  <div
                    key={assignee.accountId}
                    className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{assignee.name}</p>
                          <p className="text-xs text-gray-500">{assignee.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Efficiency</p>
                        <p className="font-bold text-emerald-600">{assignee.averageEfficiencyScore?.toFixed(1) || '0.0'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Issues</p>
                        <p className="font-bold text-indigo-600">{assignee.totalIssuesCompleted}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Avg Time</p>
                        <p className="font-bold text-blue-600">{assignee.averageTimeHours?.toFixed(1) || '0.0'}h</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cost</p>
                        <p className="font-bold text-purple-600">${assignee.totalCostIncurred?.toFixed(0) || '0'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <LineChart className="w-6 h-6 text-purple-600" />
                Cost Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Project Cost</p>
                  <p className="text-3xl font-extrabold text-blue-600">${stats.totalCost.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all issues</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Team Cost</p>
                  <p className="text-3xl font-extrabold text-purple-600">${stats.totalCostIncurred.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">By assignees</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Avg Cost/Issue</p>
                  <p className="text-3xl font-extrabold text-emerald-600">
                    ${stats.totalIssues > 0 ? (stats.totalCost / stats.totalIssues).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per issue average</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {stats && stats.totalIssues === 0 && (
          <div className="text-center py-32 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50">
            <BarChart3 className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Data Available</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              {selectedProject === "all"
                ? "Sync issues from your projects to see analytics. Visit the GenAI page to sync data."
                : "No issues found for this project. Sync issues to see analytics."}
            </p>
            <button
              onClick={() => navigate("/genai")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Sync Project Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

