import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MdOutlineContentCopy,
  MdOutlineDelete,
  MdOutlineEdit,
} from "react-icons/md";
import { FaYoutube, FaTwitter, FaCheck } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRecoilState } from "recoil";
import { inputValueState, refreshKeyState, tagsState } from "@/store/atoms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import e from "cors";
import TwitterEmbed from "@/components/TwitterEmbed";
const API_BASE = import.meta.env.VITE_API_BASE;

interface dataInterface {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  createdAt: string;
}
const Dashboard = () => {
  const rawToken = localStorage.getItem("token");
  const token = rawToken && rawToken != "null" ? JSON.parse(rawToken) : null;

  const navigate = useNavigate();
  const [data, setData] = useState<dataInterface[]>([]);
  const [copied, setCopied] = useState(true);
  const [copyId, setCopyId] = useState("");
  const [inputValue, setInputValue] = useRecoilState(inputValueState);
  const [tags, setTags] = useRecoilState(tagsState);
  const [tagValue, setTagValue] = useState("");
  const [refreshkey, setRefreshKey] = useRecoilState(refreshKeyState);
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get(`${API_BASE}/content`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setData([...res.data.contents]);
      })
      .catch((res) => console.log(res));
  }, [refreshkey]);

  const copyHandler = (link: string, id: string) => {
    setCopyId(id);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const editValuesHandler = async (id: string) => {
    if (!token) {
      return;
    }
    await axios
      .get(`${API_BASE}/content/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setInputValue({
          title: res.data.content.title,
          link: res.data.content.link,
          tags: [...res.data.content.tags],
        });
        setTags([res.data.content.tags]);
      });
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

  const submithandler = async (id: string) => {
    if (tagValue) {
      const newtags = [...tags, tagValue.trim()];
      setTags(newtags);
      setInputValue({ ...inputValue, tags: newtags });
      setTagValue("");
    }
    await axios
      .put(
        `${API_BASE}/content/${id}`,
        { ...inputValue },
        { headers: { Authorization: token } }
      )
      .then((res) => console.log(res))
      .catch((res) => console.log(res));
    setInputValue({ title: "", link: "", tags: [] });
    setTags([]);
    setRefreshKey((value) => value + 1);
  };
  const deleteContent = async (id: string) => {
    if (!token) {
      return;
    }
    await axios
      .delete(`${API_BASE}/content/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => console.log(res))
      .catch((res) => console.log(res));
    setRefreshKey((value) => value + 1);
  };
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="flex justify-start mt-5 mb-5 m-auto flex-wrap bg-warning text-warning-foreground">
      {data.map((e: dataInterface) => {
        const youtube = e.link.includes("youtube.com");
        const twitter =
          e.link.includes("twitter.com ") || e.link.includes("x.com");
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
              return `https://www.youtube.com/embed/${match[1]}`; // Use HTTPS
            }
          }
        }

        const nlink = convertToEmbedUrl(e.link);

        return (
          <Card
            className=" md:w-96 w-full h-[480px] overflow-auto m-3 ml-20"
            key={e._id}
          >
            <CardHeader>
              <CardTitle className="flex justify-around items-center ">
                <div>
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
                <p className="text-center p-1">{e.title}</p>
                <div className="flex">
                  {copied && copyId == e._id ? (
                    <FaCheck className="text-2xl " />
                  ) : (
                    <MdOutlineContentCopy
                      className="text-2xl cursor-pointer"
                      onClick={() => copyHandler(e.link, e._id)}
                    />
                  )}
                  <Dialog>
                    <DialogTrigger onClick={() => editValuesHandler(e._id)}>
                      <MdOutlineEdit className="text-2xl ml-2 cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="text-3xl">
                        Add Content
                      </DialogHeader>
                      <DialogDescription>
                        <Input
                          placeholder="title"
                          type="text"
                          value={inputValue.title}
                          className="my-6"
                          onChange={(e) =>
                            setInputValue({
                              ...inputValue,
                              title: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="link"
                          type="text"
                          value={inputValue.link}
                          className="my-6"
                          onChange={(e) =>
                            setInputValue({
                              ...inputValue,
                              link: e.target.value,
                            })
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
                          onClick={() => submithandler(e._id)}
                          disabled={!inputValue.title || !inputValue.link}
                        >
                          Update Link
                        </Button>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  <MdOutlineDelete
                    className="text-2xl ml-2 cursor-pointer"
                    onClick={() => deleteContent(e._id)}
                  />
                </div>
              </CardTitle>
              {twitter && (
                <div className="rounded-lg px-2">
                  <blockquote className="twitter-tweet">
                    <TwitterEmbed url={e.link} />
                  </blockquote>
                </div>
              )}
              {youtube && (
                <div className="rounded-lg ">
                  <iframe
                    src={nlink}
                    title="Youtube Video player"
                    className=" w-full h-80 px-5 pb-2 rounded-lg mt-5"
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
      {!data.length && (
        <h1 className="flex justify-center items-center w-screen h-[80vh] text-6xl">
          No Content
        </h1>
      )}
    </div>
  );
};

export default Dashboard;
