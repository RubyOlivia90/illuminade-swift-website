import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const DownloadPage = () => {
  const [params] = useSearchParams();
  const imageUrl = params.get("imageUrl");
  const title = params.get("title");

  useEffect(() => {
    if (imageUrl) {
      // trigger download automatically
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = title ? `${title}.jpg` : "download.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [imageUrl, title]);

  if (!imageUrl || !title) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Invalid download link</h1>
        <p>Please contact support if this issue persists.</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
      <p>Your download should begin automatically.</p>
      <p>
        If it doesn’t,{" "}
        <a
          href={imageUrl}
          download={`${title}.jpg`}
          className="text-blue-500 underline"
        >
          click here
        </a>
        .
      </p>
    </div>
  );
};

export default DownloadPage;
