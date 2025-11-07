import { NavLink } from "react-router-dom";

type TabsProps = {
  tabs: {
    label: string;
    to: string;
  }[];
}
export function Tabs({ tabs }: TabsProps) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const inactive =
    "text-slate-300 hover:text-white hover:bg-slate-700/70";
  const active =
    "bg-[#3b82f6] text-white hover:bg-[#3b82f6]/80";

  return (
    <nav aria-label="Principal">
      <ul className="flex items-center gap-2">
        {tabs.map((tab) => (
          <li key={tab.label}>
            <NavLink
              to={tab.to}
              className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
