import { NavLink } from "react-router-dom";

type TabsProps = {
  tabs: {
    label: string;
    to: string;
    onClick?: () => void;
  }[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onSelect?: (path: string) => void;
}
export function Tabs({ tabs, orientation = 'horizontal', className = '', onSelect }: TabsProps) {
  const base =
    "py-2 rounded-md text-sm font-medium transition-colors";
  const inactive =
    "text-slate-300 hover:text-white hover:bg-slate-700/70 px-1";
  const active =
    "bg-[#3b82f6] text-white hover:bg-[#3b82f6]/80 px-4";
  const listBase = "flex gap-2";
  const directionClasses = orientation === 'vertical'
    ? "flex-col items-start"
    : "flex-row items-center";
  const listClasses = [listBase, directionClasses, className].filter(Boolean).join(' ');

  return (
    <nav aria-label="Principal">
      <ul className={listClasses}>
        {tabs.map((tab) => (
          <li key={tab.label}>
            <NavLink
              to={tab.to}
              onClick={() =>{
                onSelect?.(tab.to);
                tab.onClick?.();
              }}
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
