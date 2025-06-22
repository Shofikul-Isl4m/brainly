import React from "react";

import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MdOutlineContentCopy } from "react-icons/md";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

import axios from "axios";
import { FaCheck } from "react-icons/fa6";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { inputValueState, refreshKeyState, tagsState } from "@/store/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ModeToggle } from "./mode-toggle";
const API_BASE = import.meta.env.VITE_API_BASE;

const Navbar = () => {
  const [inputValue, setInputValue] = useRecoilState(inputValueState);
  const [tags, setTags] = useRecoilState(tagsState);
  const [tagValue, setTagValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharedLink, setSharedLink] = useState("");
  const [sharable, setSharable] = useState(false);
  const setRefreshKey = useSetRecoilState(refreshKeyState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const tokenRaw = localStorage.getItem("token");
  const token = tokenRaw ? JSON.parse(tokenRaw) : null;

  useEffect(() => {
    if (!token) {
      return;
    }
    axios
      .get(`${API_BASE}/shareon`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setSharable(res.data.isSharing);
        setSharedLink(`${window.location.origin}/share` + res.data.slug);
      });
  }, []);

  function checkedchangedhandler() {
    if (!sharable) {
      axios
        .post(
          `${API_BASE}/shareon`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          setSharable(res.data.isSharing);
          setSharedLink(`${window.location.origin}/share/` + res.data.slug);
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      axios
        .post(
          `${API_BASE}/shareoff`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          setSharedLink("");
          setSharable(res.data.isSharing);
        });
    }
  }

  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(sharedLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Faailed to Copy :", error);
    }
  };

  const handleFilterTags = (e: string) => {
    const newTags = tags.filter((tag) => tag != e);
    setTags(newTags);
    setInputValue({ ...inputValue, tags: newTags });
  };

  const handleTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (tagValue) {
        const newTags = [...tags, tagValue.trim()];
        setTags(newTags);
        setInputValue({ ...inputValue, tags: newTags });
        setTagValue("");
      }
    }
  };
  const submithandler = async (onsuccess?: any) => {
    try {
      const newtags = [...tags, tagValue.trim()];
      const payload = { ...inputValue, tags: newtags };

      // 👇 Wait for the request to complete
      const response = await axios.post(`${API_BASE}/content`, payload, {
        headers: { Authorization: token },
      });

      console.log("✅ Success:", response.data);

      // Reset only AFTER success
      setInputValue({ title: "", link: "", tags: [] });
      setTags([]);
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      console.error("❌ Failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-between items-center px-10 py-5">
      <Sidebar />
      <div className="mr-10 flex items-center ">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer   rounded-sm "> Share </Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <DialogTitle className="text-3xl">Share Your Link</DialogTitle>
            <DialogDescription>
              <h1 className="flex items-center justify-start ">
                Do You Want to Share all Your Links
                <Switch
                  className="ml-6"
                  onCheckedChange={checkedchangedhandler}
                  checked={sharable}
                />
              </h1>
              {sharable && (
                <div className=" flex items-center justify-between my-5">
                  <h1 className="border px-10 py-3">{sharedLink}</h1>
                  <Button
                    className="cursor-pointer ml-6 "
                    onClick={copyHandler}
                  >
                    {copied ? (
                      <FaCheck className="text-2xl" />
                    ) : (
                      <MdOutlineContentCopy className="text-2xl" />
                    )}
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              // This handles:
              // - Clicking outside the dialog
              // - Pressing Escape
              // - Clicking the X button
              setDialogOpen(false);
            }
          }}
        >
          <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
            <Button className="mx-3  rounded-sm">Add Content</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader className="text-3xl">Add Content</DialogHeader>
            <DialogDescription>
              <Input
                placeholder="title"
                type="text"
                value={inputValue.title}
                className="my-6"
                onChange={(e) =>
                  setInputValue({ ...inputValue, title: e.target.value })
                }
              />
              <Input
                placeholder="link"
                type="text"
                value={inputValue.link}
                className="my-6"
                onChange={(e) =>
                  setInputValue({ ...inputValue, link: e.target.value })
                }
              />
              <div className="h-[100px] border my-4 overflow-y-scroll">
                {tags.map((e, i) => {
                  return (
                    <Badge className="m-2" key={e + i}>
                      {e}{" "}
                      <span
                        className="text-accent text-lg ml-1"
                        onClick={() => handleFilterTags(e)}
                      >
                        x
                      </span>
                    </Badge>
                  );
                })}
              </div>

              <Input
                placeholder="tags"
                type="text"
                value={tagValue}
                onKeyDown={handleTags}
                onChange={(e) => {
                  setTagValue(e.target.value);
                }}
              />
              <Button
                className="mt-2 cursor-pointer rounded-sm w-full"
                onClick={submithandler(() => setDialogOpen(false))}
                disabled={!inputValue.title || !inputValue.link}
              >
                Add Link
              </Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
