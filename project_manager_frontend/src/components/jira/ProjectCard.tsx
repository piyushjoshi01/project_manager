import { ArrowRight, User, Sparkles } from "lucide-react";

type ProjectCardProps = {
  id: string;
  name: string;
  projectKey: string;
  lead?: { displayName: string } | null;
  onClick: () => void;
};

// Generate a color based on project key for visual variety
const getCardGradient = (key: string) => {
  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-purple-500 via-pink-500 to-rose-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-orange-500 via-red-500 to-pink-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
  ];
  const index = key.charCodeAt(0) % gradients.length;
  return gradients[index];
};

export default function ProjectCard({
  id,
  name,
  projectKey,
  lead,
  onClick,
}: ProjectCardProps) {
  const gradient = getCardGradient(projectKey);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="
        group cursor-pointer relative overflow-hidden h-full
        rounded-2xl bg-white border-2 border-gray-200/60
        p-6 transition-all duration-500 ease-out flex flex-col
        hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-300/60
        focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:ring-offset-2
        active:scale-[0.98]
      "
      style={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Gradient Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="text-xl font-extrabold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
              {name}
            </h2>
          </div>

          <div className={`flex-shrink-0 rounded-lg bg-gradient-to-r ${gradient} px-3 py-1.5 shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              {projectKey}
            </span>
          </div>
        </div>

        {/* Lead Section */}
        {lead && (
          <div className="mb-5 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50">
            <div className="flex items-center space-x-2.5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Project Lead</p>
                <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{lead.displayName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Divider with gradient */}
        <div className="mb-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* CTA Section - Push to bottom */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
            Explore Project
          </span>

          <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-300`}>
            <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative corner element */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500`}></div>
    </div>
  );
}
