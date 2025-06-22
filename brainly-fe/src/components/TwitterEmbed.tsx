import { useEffect } from "react";

const TwitterEmbed = ({ url }: { url: string }) => {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="twitter-embed">
      <blockquote className="twitter-tweet">
        <a href={url.replace("x.com", "twitter.com")}></a>
      </blockquote>
    </div>
  );
};

export default TwitterEmbed;
