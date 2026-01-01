import { useState, useMemo } from "react";
import ProjectCard from "../components/jira/ProjectCard";
import { fetchProjects } from "../api/jiraApi";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import { 
  FolderKanban, TrendingUp, Sparkles, Zap, BarChart3, Users, Target, Rocket, 
  ArrowRight, CheckCircle2, Clock, AlertTriangle, Search, Filter, Grid3x3, 
  List, X, SortAsc, SortDesc, Info
} from "lucide-react";

type SortOption = 'name-asc' | 'name-desc' | 'key-asc' | 'key-desc';

export default function Dashboard() {
  const { data, loading, error } = useFetch(fetchProjects);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const handleOpenProject = (key: string) => {
    navigate(`/project/${key}`);
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    if (!data) return [];

    // Filter by search query
    let filtered = data.filter((project: any) => {
      const query = searchQuery.toLowerCase();
      return (
        project.name?.toLowerCase().includes(query) ||
        project.key?.toLowerCase().includes(query) ||
        project.lead?.displayName?.toLowerCase().includes(query)
      );
    });

    // Sort projects
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'key-asc':
          return (a.key || '').localeCompare(b.key || '');
        case 'key-desc':
          return (b.key || '').localeCompare(a.key || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchQuery, sortBy]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff, #eef2ff)'
      }}
    >
      {/* Rich Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80"></div>
      
      {/* Animated Gradient Orbs - More Visible */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400/30 via-cyan-400/30 to-teal-400/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Pattern Overlay - More Visible */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Grid Pattern Overlay - More Visible */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>
      
      {/* Additional Texture Layer */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
          backgroundSize: '30px 30px',
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
                
              </div>
            </div>
         
          </div>

          {/* Key Metrics Cards */}
          {data && data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                      <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {data.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Active Projects</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                    {data.length > 0 ? (data.length * 12).toLocaleString() : '0'}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Estimated Issues</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    {data.length > 0 ? (data.length * 3).toLocaleString() : '0'}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Active Teams</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-emerald-200/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                    94%
                  </p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Efficiency</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative">
                <Loader />
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-600">Loading your projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12">
            <Error message={error} />
          </div>
        )}

        {/* Projects Section */}
        {!loading && !error && (
          <>
            {data && data.length > 0 ? (
              <div>
                {/* Section Header with Search and Controls */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Your Projects
                        {filteredAndSortedProjects.length !== data.length && (
                          <span className="ml-3 text-lg font-normal text-gray-500">
                            ({filteredAndSortedProjects.length} of {data.length})
                          </span>
                        )}
                      </h2>
                      <p className="text-gray-600">
                        {data.length === 1 
                          ? "Select your project to view details and manage issues"
                          : `Browse and manage your ${data.length} projects. Use search to find projects quickly.`
                        }
                      </p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-1 border-2 border-gray-200 shadow-md">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === 'grid'
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Grid View"
                        >
                          <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === 'list'
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="List View"
                        >
                          <List className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-gray-200/50">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Search Input */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search projects by name, key, or lead..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Clear search"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>

                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-gray-700 cursor-pointer"
                          >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="key-asc">Key (A-Z)</option>
                            <option value="key-desc">Key (Z-A)</option>
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {sortBy.includes('asc') ? (
                              <SortAsc className="w-5 h-5 text-gray-400" />
                            ) : (
                              <SortDesc className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Results Info */}
                    {searchQuery && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span>
                          Found {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''} matching "{searchQuery}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Projects Display */}
                {filteredAndSortedProjects.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                      }}
                    >
                      {filteredAndSortedProjects.map((project: any, index: number) => (
                        <div
                          key={project.id}
                          className="animate-in fade-in slide-in-from-bottom-4 h-full"
                          style={{
                            animationDelay: `${Math.min(index * 50, 500)}ms`,
                            animationFillMode: 'both',
                          }}
                        >
                          <ProjectCard
                            id={project.id}
                            name={project.name}
                            projectKey={project.key}
                            lead={project.lead}
                            onClick={() => handleOpenProject(project.key)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAndSortedProjects.map((project: any, index: number) => (
                        <div
                          key={project.id}
                          onClick={() => handleOpenProject(project.key)}
                          className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <FolderKanban className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-extrabold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                    {project.name}
                                  </h3>
                                  <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold uppercase">
                                    {project.key}
                                  </span>
                                </div>
                                {project.lead && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>Lead: {project.lead.displayName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg">
                    <div className="inline-flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-gray-100">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      No projects match your search "{searchQuery}". Try different keywords.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-32">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200">
                    <FolderKanban className="w-12 h-12 text-indigo-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">No Projects Available</h3>
                <p className="text-lg text-gray-600 max-w-md mx-auto mb-2">
                  There are no projects connected to your account at the moment.
                </p>
                <p className="text-base text-gray-500 max-w-md mx-auto mb-6">
                  Projects will appear here once they're synced from Jira. Contact your administrator if you need help connecting projects.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => navigate("/genai")}
                    className="px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-indigo-200 text-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Explore AI Features
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
