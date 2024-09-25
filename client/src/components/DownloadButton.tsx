"use client";

import { useAuth } from "@/context/AuthContext";
import { Download } from "lucide-react";

const DownloadButton = ({ fileurl }: any) => {
  const { user } = useAuth();

  const downloadFileAtUrl = async (url: any) => {
    if (!url) {
      console.error("URL is undefined or null");
      return;
    }

    try {
      // console.log(`Downloading file from URL: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf", // Set the correct content type
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const filename = url.split("/").pop();
      const aTag = document.createElement("a");
      const urlObject = URL.createObjectURL(blob);
      aTag.href = urlObject;
      aTag.setAttribute("download", filename);
      document.body.appendChild(aTag);
      aTag.click();
      URL.revokeObjectURL(urlObject); // Clean up URL object
      aTag.remove();
      console.log("Download initiated");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadClick = () => {
    const userConfirmed = window.confirm("Do you want to download this file?");
    if (userConfirmed) {
      if (user) {
        downloadFileAtUrl(fileurl);
      } else {
        alert("Please Login first");
      }
    } else {
      console.log("Download canceled by user.");
    }
  };

  return (
    <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
      <button onClick={handleDownloadClick}>
        <Download size={24} />
      </button>
    </div>
  );
};

export default DownloadButton;
