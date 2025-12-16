import { useState, useEffect, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMilestones, createMilestone, updateMilestone, deleteMilestone, fetchIssuesByProject } from "../api/jiraApi";
import { Milestone, MilestoneStatus } from "../types/milestone.types";
import { ArrowLeft, Plus, Edit2, Trash2, Table, Calendar, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";

export default function Milestones() {
  const { projectKey } = useParams<{ projectKey: string }>();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [editingId, setEditingId] = useState<string | null>(null);
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
    if (!projectKey) return;
    try {
      setLoading(true);
      const data = await fetchMilestones(projectKey);
      setMilestones(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  // Calculate milestone status based on issues
  const calculateStatus = async (milestone: Milestone): Promise<MilestoneStatus> => {
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

      issues.forEach((issue: any) => {
        const status = issue.fields?.status?.name?.toLowerCase() || '';
        if (status.includes('done') || status.includes('complete') || status.includes('resolved')) {
          statusCounts.completed++;
        } else if (status.includes('progress') || status.includes('in progress')) {
          statusCounts.inProgress++;
        } else if (status.includes('backlog')) {
          statusCounts.backlog++;
        } else {
          statusCounts.toDo++;
        }
      });

      const actualProgress = statusCounts.total > 0 
        ? (statusCounts.completed / statusCounts.total) * 100 
        : 0;

      const progressDiff = expectedProgress - actualProgress;
      const remainingTasks = statusCounts.toDo + statusCounts.backlog + statusCounts.inProgress;
      let status: 'on-track' | 'at-risk' | 'delayed' = 'on-track';

      // Status calculation logic
      if (elapsedDays > totalDays && actualProgress < 100) {
        status = 'delayed';
      } else if (progressDiff > 20) {
        status = 'delayed';
      } else if (progressDiff > 10 || remainingTasks > statusCounts.completed) {
        status = 'at-risk';
      } else {
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
    } catch (err) {
      return { totalIssues: 0, toDo: 0, backlog: 0, completed: 0, inProgress: 0, status: 'on-track', progress: 0 };
    }
  };

  const handleCreate = async () => {
    if (!projectKey) return;
    try {
      await createMilestone(projectKey, formData);
      setIsCreating(false);
      setFormData({ name: '', startDate: '', endDate: '', description: '' });
      loadMilestones();
    } catch (err: any) {
      setError(err.message || 'Failed to create milestone');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!projectKey) return;
    try {
      await updateMilestone(projectKey, id, formData);
      setEditingId(null);
      setFormData({ name: '', startDate: '', endDate: '', description: '' });
      loadMilestones();
    } catch (err: any) {
      setError(err.message || 'Failed to update milestone');
    }
  };

  const handleDelete = async (id: string) => {
    if (!projectKey || !confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await deleteMilestone(projectKey, id);
      loadMilestones();
    } catch (err: any) {
      setError(err.message || 'Failed to delete milestone');
    }
  };

  const startEdit = (milestone: Milestone) => {
    setEditingId(milestone.id || '');
    setFormData({
      name: milestone.name,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      description: milestone.description
    });
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'at-risk':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'delayed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/project/${projectKey}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Issues</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Milestones
              </h1>
              <p className="text-lg text-gray-600 font-medium">Project: {projectKey}</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-md border border-gray-200">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Table className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'timeline' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>New Milestone</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <Error message={error} />}

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="mb-6 bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Milestone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="milestone-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Milestone Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="milestone-name"
                  type="text"
                  placeholder="Enter milestone name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="Enter milestone description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setFormData({ name: '', startDate: '', endDate: '', description: '' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {milestones.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No milestones found. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    milestones.map((milestone, index) => (
                      <MilestoneRow
                        key={milestone.id || index}
                        milestone={milestone}
                        onEdit={() => startEdit(milestone)}
                        onDelete={() => handleDelete(milestone.id || '')}
                        calculateStatus={calculateStatus}
                        getStatusColor={getStatusColor}
                        getStatusIcon={getStatusIcon}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <TimelineView milestones={milestones} calculateStatus={calculateStatus} />
        )}
      </div>
    </div>
  );
}

// Milestone Row Component with async status calculation
function MilestoneRow({ 
  milestone, 
  onEdit, 
  onDelete, 
  calculateStatus,
  getStatusColor,
  getStatusIcon 
}: {
  milestone: Milestone;
  onEdit: () => void;
  onDelete: () => void;
  calculateStatus: (m: Milestone) => Promise<MilestoneStatus>;
  getStatusColor: (s: string) => string;
  getStatusIcon: (s: string) => JSX.Element;
}) {
  const [status, setStatus] = useState<MilestoneStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    calculateStatus(milestone).then((s) => {
      setStatus(s);
      setLoadingStatus(false);
    });
  }, [milestone]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">{milestone.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{new Date(milestone.startDate).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{new Date(milestone.endDate).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs truncate">{milestone.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {loadingStatus ? (
          <div className="w-24 h-2 bg-gray-200 rounded-full animate-pulse"></div>
        ) : status ? (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
              <div
                className={`h-2 rounded-full transition-all ${getStatusColor(status.status)}`}
                style={{ width: `${status.progress}%` }}
              ></div>
            </div>
            {getStatusIcon(status.status)}
            <span className="text-xs font-medium text-gray-600">{status.progress.toFixed(0)}%</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">N/A</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Timeline View Component
function TimelineView({ 
  milestones, 
  calculateStatus 
}: { 
  milestones: Milestone[]; 
  calculateStatus: (m: Milestone) => Promise<MilestoneStatus> 
}) {
  const [statuses, setStatuses] = useState<Map<string, MilestoneStatus>>(new Map());

  useEffect(() => {
    const loadStatuses = async () => {
      const statusMap = new Map();
      for (const milestone of milestones) {
        const status = await calculateStatus(milestone);
        statusMap.set(milestone.id || milestone.name, status);
      }
      setStatuses(statusMap);
    };
    if (milestones.length > 0) {
      loadStatuses();
    }
  }, [milestones]);

  if (milestones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No milestones to display</p>
      </div>
    );
  }

  // Calculate timeline bounds
  const dates = milestones.flatMap(m => [
    new Date(m.startDate).getTime(),
    new Date(m.endDate).getTime()
  ]);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-6">Project Timeline</h3>
      <div className="space-y-6">
        {milestones.map((milestone, index) => {
          const status = statuses.get(milestone.id || milestone.name);
          const startDate = new Date(milestone.startDate);
          const endDate = new Date(milestone.endDate);
          const left = ((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
          const width = ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;

          return (
            <div key={milestone.id || index} className="relative">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-48 flex-shrink-0">
                  <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                  <p className="text-sm text-gray-500">{milestone.description}</p>
                </div>
                <div className="flex-1 relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`absolute h-full rounded-lg ${
                      status?.status === 'on-track' ? 'bg-green-500' :
                      status?.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      opacity: 0.7
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="w-24 flex-shrink-0 text-right">
                  {status && (
                    <div className="flex items-center justify-end space-x-1">
                      {status.status === 'on-track' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {status.status === 'at-risk' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                      {status.status === 'delayed' && <XCircle className="w-4 h-4 text-red-600" />}
                      <span className="text-xs font-medium text-gray-600">{status.progress.toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Timeline Scale */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{minDate.toLocaleDateString()}</span>
          <span>{maxDate.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

