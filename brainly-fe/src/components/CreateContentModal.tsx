import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";

enum ContentType {
  Youtube = "youtube"
  Twitter = "twitter"
}

export function CreateContentModal({ open, onClose }) {
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [type,setType] =useState(ContentType.Youtube)

  function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
  }
  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 bg-slate-200/60 backdrop-blur-sm flex justify-center ">
          <div className="flex flex-col justify-center">
            <span className="bg-white opacity-100 p-4 rounded">
              <div className="flex justify-end ">
                <div onClick={onClose} className="cursor-pointer">
                  <CrossIcon />
                </div>
              </div>
              <div>
                <Input ref={titleRef} placeholder={"title"} />
                <Input ref={linkRef} placeholder={"Link"} />
              </div>
              <div className="flex justify-center">
                <Button variant="primary" text="Submit" />
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
