import type { ReactElement } from "react";

export function SidebarItem({
  text,
  icon,
}: {
  text: string;
  icon: ReactElement;
}) {
  return (
    <div className="flex py-2 cursor-pointer hover:bg-gray-200 rounded max-w-48 pl-4 duration-1000 transition-all">
      <div>{icon}</div>
      <div className="ml-2">{text}</div>
    </div>
  );
}
