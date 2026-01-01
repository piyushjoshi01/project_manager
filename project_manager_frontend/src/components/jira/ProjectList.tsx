import { useFetch } from "hooks/useFetch"; 
import { fetchProjects } from "api/jiraApi";
import Loader from "components/common/Loader";
import Error from "components/common/Error";

interface JiraProject {
  id: string;
  key: string;
  name: string;
  lead?: {
    displayName: string;
  };
}

export default function ProjectList({
  onSelect,
}: {
  onSelect: (key: string) => void;
}) {
  const { data, loading, error } = useFetch<JiraProject[]>(fetchProjects);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="grid gap-4 p-4">
      {data?.map((project) => (
        <button
          key={project.key}
          onClick={() => onSelect(project.key)}
          className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition text-left"
        >
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Key: {project.key}</p>

          {project.lead?.displayName && (
            <p className="text-sm text-gray-500 mt-1">
              Lead: {project.lead.displayName}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
