import { SidebarItem } from "./SidebarItem";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { Logo } from "../icons/Logo";

export function Sidebar() {
  return (
    <div className=" h-screen bg-white border-r w-72 fixed pl-4 ">
      <div className="pt-4">
        <div className="flex text-2xl items-center pt-8">
          <div className="pr-4 text-purple-700">
            <Logo />
          </div>
          Brainly
        </div>
        <div className="mt-8">
          <SidebarItem text="Twitter" icon={<TwitterIcon />} />
          <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
        </div>
      </div>
    </div>
  );
}
