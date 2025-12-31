import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { Home, FolderKanban, Sparkles, BarChart3, Bell, Search, Bot } from "lucide-react";
export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };
    const navItems = [
        { path: "/", label: "Dashboard", icon: Home },
        // { path: "/projects", label: "Projects", icon: FolderKanban },
        { path: "/genai", label: "GenAI", icon: Bot },
        { path: "/analytics", label: "Analytics", icon: BarChart3 },
    ];
    return (_jsx("nav", { className: "bg-white/98 backdrop-blur-lg border-b-2 border-gray-200/80 shadow-lg sticky top-0 z-50", style: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderBottom: '2px solid rgba(229, 231, 235, 0.8)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }, children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", style: { maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }, children: _jsxs("div", { className: "flex justify-between items-center h-20", style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '80px',
                    flexDirection: 'row'
                }, children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-3 group flex-shrink-0", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity" }), _jsx("div", { className: "relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform", children: _jsx(FolderKanban, { className: "w-6 h-6 text-white" }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent", children: "Project Manager Pro" }), _jsxs("p", { className: "text-xs font-semibold text-gray-600 flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-3 h-3 text-purple-500" }), "AI-Powered Project Intelligence"] })] })] }), _jsx("div", { className: "flex items-center space-x-1 sm:space-x-2 flex-1 justify-center mx-2 sm:mx-4 lg:mx-8 overflow-x-auto", style: {
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                            margin: '0 1rem',
                            flexDirection: 'row',
                            gap: '0.5rem'
                        }, children: navItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs(Link, { to: item.path, className: `
                    flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold
                    transition-all duration-200 relative whitespace-nowrap flex-shrink-0
                    ${isActive(item.path)
                                    ? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50 scale-105"
                                    : "text-gray-700 hover:text-indigo-700 hover:bg-gray-100"}
                  `, children: [_jsx(Icon, { className: "w-4 h-4 flex-shrink-0" }), _jsx("span", { children: item.label }), isActive(item.path) && (_jsx("div", { className: "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" }))] }, item.path));
                        }) }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("button", { className: "p-2 rounded-lg text-gray-600 hover:text-indigo-700 hover:bg-gray-100 transition-colors", children: _jsx(Search, { className: "w-5 h-5" }) }), _jsxs("button", { className: "relative p-2 rounded-lg text-gray-600 hover:text-indigo-700 hover:bg-gray-100 transition-colors", children: [_jsx(Bell, { className: "w-5 h-5" }), _jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" })] }), _jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-md", children: _jsx("span", { className: "text-white font-bold text-sm", children: "PM" }) })] })] }) }) }));
}
