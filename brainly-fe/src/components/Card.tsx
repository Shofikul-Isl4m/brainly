import { ShareIcon } from "../icons/ShareIcon";

export function Card() {
  return (
    <div>
      <div className="p-8 bg-white rounded-sm shadow-md outline-slate-200 max-w-96 border">
        <div className="flex justify-between">
          <div className="flex items-center">
            <ShareIcon />
            Project ideas
          </div>
          <div className="flex ">
            <ShareIcon />
            <ShareIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
