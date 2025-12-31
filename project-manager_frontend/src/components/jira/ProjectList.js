import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFetch } from "hooks/useFetch";
import { fetchProjects } from "api/jiraApi";
import Loader from "components/common/Loader";
import Error from "components/common/Error";
export default function ProjectList({ onSelect, }) {
    const { data, loading, error } = useFetch(fetchProjects);
    if (loading)
        return _jsx(Loader, {});
    if (error)
        return _jsx(Error, { message: error });
    return (_jsx("div", { className: "grid gap-4 p-4", children: data?.map((project) => (_jsxs("button", { onClick: () => onSelect(project.key), className: "p-4 bg-white border rounded-xl shadow hover:shadow-md transition text-left", children: [_jsx("h3", { className: "text-lg font-semibold", children: project.name }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["Key: ", project.key] }), project.lead?.displayName && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Lead: ", project.lead.displayName] }))] }, project.key))) }));
}
