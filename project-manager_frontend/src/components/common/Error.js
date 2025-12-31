import { jsx as _jsx } from "react/jsx-runtime";
export default function Error({ message }) {
    return _jsx("div", { className: "text-red-500 text-center p-4", children: message });
}
