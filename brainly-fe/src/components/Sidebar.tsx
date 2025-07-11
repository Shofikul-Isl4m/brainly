import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LuLayoutGrid, LuBrain } from "react-icons/lu";
import { FaYoutube, FaTwitter, FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { refreshKeyState } from "@/store/atoms";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const setRefreshKey = useSetRecoilState(refreshKeyState);
  const [isOpen, setIsOpen] = useState(false);

  const onclickhandler = () => {
    navigate("/signup");
    localStorage.removeItem("token");
  };

  const onclickhandler2 = () => {
    navigate("/user/tweets");
    setRefreshKey((value) => value + 1);
    setIsOpen(false);
  };

  const onclickhandler3 = () => {
    navigate("/user");
    setRefreshKey((value) => value + 1);
    setIsOpen(false);
  };

  const onclickhandler4 = () => {
    navigate("/user/profile");
    setRefreshKey((value) => value + 1);
    setIsOpen(false);
  };
  const onclickhandler1 = () => {
    navigate("/user/youtube");
    setRefreshKey((value) => value + 1);
    setIsOpen(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
      }}
    >
      <SheetTrigger asChild onClick={() => setIsOpen(true)}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <h1 className="flex items-center text-3xl py-10 mx-1">
          <LuBrain className="text-[50px] mx-2" />
          Brainly
        </h1>
        <h1
          onClick={onclickhandler3}
          className="flex hover:bg-accent py-2 cursor-pointer"
        >
          <LuLayoutGrid className=" mx-5 text-3xl" />
          Dashboard
        </h1>
        <h1
          onClick={onclickhandler1}
          className="flex hover:bg-accent py-2 cursor-pointer"
        >
          <FaYoutube className=" mx-5 text-3xl" />
          Youtube
        </h1>
        <h1
          onClick={onclickhandler2}
          className="flex hover:bg-accent py-2 cursor-pointer"
        >
          <FaTwitter className=" mx-5 text-3xl" />
          Tweets
        </h1>
        <h1
          onClick={onclickhandler4}
          className="flex hover:bg-accent py-2 cursor-pointer"
        >
          <FaUser className=" mx-5 text-3xl" />
          Profile
        </h1>
        <h1
          onClick={onclickhandler}
          className="flex hover:bg-accent py-2 cursor-pointer"
        >
          <IoIosLogOut className=" mx-5 text-3xl" />
          Logout
        </h1>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
