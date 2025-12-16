import ProjectCard from "../components/jira/ProjectCard";
import { fetchProjects } from "../api/jiraApi";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import { FolderKanban, TrendingUp, Sparkles, Zap } from "lucide-react";

export default function Dashboard() {
  const { data, loading, error } = useFetch(fetchProjects);
  const navigate = useNavigate();

  const handleOpenProject = (key: string) => {
    navigate(`/project/${key}`);
  };

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
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
                  <FolderKanban className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Your Projects
                </h1>
                <p className="text-lg text-gray-600 font-medium flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Manage and track all your Jira projects in one place
                </p>
              </div>
            </div>
            
            {data && data.length > 0 && (
              <div className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Projects</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {data.length}
                  </p>
                </div>
              </div>
            )}
          </div>
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

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {data && data.length > 0 ? (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {data.map((project: any, index: number) => (
                  <div
                    key={project.id}
                    className="animate-in fade-in slide-in-from-bottom-4 h-full"
                    style={{
                      animationDelay: `${index * 100}ms`,
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
              <div className="text-center py-32">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200">
                    <FolderKanban className="w-12 h-12 text-indigo-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">No projects found</h3>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no projects available at the moment. Check back later or create a new project.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
