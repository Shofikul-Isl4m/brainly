import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaYoutube, FaTwitter, FaCheck } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NoPage from "./NoPage";
import { MdOutlineContentCopy } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { refreshKeyState } from "@/store/atoms";
import TwitterEmbed from "@/components/TwitterEmbed";
const API_BASE = import.meta.env.VITE_API_BASE;

interface dataInterface {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  createdAt: string;
}
const SharedPage = () => {
  const [data, setData] = useState<dataInterface[]>([]);
  const [copied, setCopied] = useState(false);
  const [copyId, setCopyId] = useState("");
  const { id } = useParams();
  const refreshkey = useRecoilValue(refreshKeyState);
  useEffect(() => {
    axios
      .get(`${API_BASE}/share/${id}`)
      .then((res) => {
        setData([...res.data]);
      })
      .catch(() => {
        setData([]);
      });
  }, [refreshkey]);

  const copyHandler = (link: string, id: string) => {
    setCopyId(id);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };
  return !data ? (
    <NoPage />
  ) : (
    <div className="flex justify-center lg:justify-start  mt-5 lg:w-[80vw] md:w-[90vw] mb-5 m-auto flex-wrap">
      {data.map((e: dataInterface) => {
        const youtube = e.link.includes("youtube.com");
        const twitter =
          e.link.includes("twitter.com") || e.link.includes("x.com");
        function convertToEmbedUrl(youtubeUrl: string) {
          // Handle various YouTube URL formats
          const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
          ];

          for (const pattern of patterns) {
            const match = youtubeUrl.match(pattern);
            if (match && match[1]) {
              return `https://www.youtube.com/embed/${match[1]}`;
            }
          }
        }
        const nlink = convertToEmbedUrl(e.link);
        return (
          <Card className=" w-96 h-[480px] overflow-auto m-3" key={e._id}>
            <CardHeader>
              <CardTitle className="flex justify-around items-center">
                <div className="flex">
                  {youtube && (
                    <FaYoutube className="text-2xl mr-4 cursor-pointer" />
                  )}
                  {twitter && (
                    <FaTwitter className="text-2xl mr-4 cursor-pointer" />
                  )}
                  {!youtube && !twitter && (
                    <HiOutlineDocument className="text-2xl mr-4 cursor-pointer" />
                  )}
                </div>
                <p className=" text-center p-1">{e.title}</p>
                <div className="flex">
                  {copied && copyId == e._id ? (
                    <FaCheck className="text-2xl duration-500 ease-in-out" />
                  ) : (
                    <MdOutlineContentCopy
                      className="text-2xl duration-500 ease-in-out cursor-pointer"
                      onClick={() => copyHandler(e.link, e._id)}
                    />
                  )}
                </div>
              </CardTitle>
              {twitter && (
                <div className=" rounded-lg px-2">
                  <blockquote className="twitter-tweet">
                    <TwitterEmbed url={e.link} />
                  </blockquote>
                </div>
              )}
              {youtube && (
                <div className=" rounded-lg">
                  <iframe
                    className=" w-full h-60 px-5 pb-2 rounded-lg mt-5"
                    width="560"
                    height="315"
                    src={nlink}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {!youtube && !twitter && (
                <a
                  href={`${e.link}`}
                  className=" mx-4 inline-block my-2 underline text-primary"
                  target="_blank"
                >
                  Your Link
                </a>
              )}
              {!youtube && !twitter && (
                <iframe src={`${e.link}`} className="w-full h-[250px]"></iframe>
              )}
            </CardHeader>
            <CardContent>
              {e.tags.map((i) => {
                return (
                  <Badge className="m-2" key={e._id + i}>
                    #{i}
                  </Badge>
                );
              })}
            </CardContent>
            <CardFooter>
              <p>Added on {formatDate(e.createdAt)}</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SharedPage;
