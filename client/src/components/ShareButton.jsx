import React, { useEffect, useRef, useState } from "react";
import { Share2, Copy } from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  PocketShareButton,
  EmailShareButton,
  VKShareButton,
  TumblrShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditIcon,
  PocketIcon,
  EmailIcon,
  VKIcon,
  TumblrIcon,
  FacebookMessengerIcon,
} from "react-share";

// Share platforms array to reduce repetition
const sharePlatforms = [
  { Component: FacebookShareButton, Icon: FacebookIcon },
  { Component: TwitterShareButton, Icon: TwitterIcon },
  { Component: LinkedinShareButton, Icon: LinkedinIcon },
  { Component: WhatsappShareButton, Icon: WhatsappIcon },
  { Component: TelegramShareButton, Icon: TelegramIcon },
  { Component: RedditShareButton, Icon: RedditIcon },
  { Component: PocketShareButton, Icon: PocketIcon },
  { Component: EmailShareButton, Icon: EmailIcon },
  { Component: VKShareButton, Icon: VKIcon },
  { Component: TumblrShareButton, Icon: TumblrIcon },
  { Component: FacebookMessengerShareButton, Icon: FacebookMessengerIcon },
];

const ShareDialog = ({ url, onClose }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    } catch (error) {
      alert("Failed to copy URL. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative flex flex-col items-center gap-4 p-4 bg-white border rounded shadow-lg z-60">
        {/* Share Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {sharePlatforms.map(({ Component, Icon }, index) => (
            <Component key={index} url={url}>
              <Icon size={32} round={true} />
            </Component>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
        >
          <span className="bg-white text-black px-3 py-1 rounded-full">
            {url}
          </span>
          <Copy size={24} color="black" />
          <span className="text-black">Copy</span>
        </button>
      </div>
    </div>
  );
};

const ShareButton = ({ url, size = 24 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareButtonRef = useRef(null);

  const toggleShareButton = () => setIsOpen((prev) => !prev);

  const closeShareButton = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target)
      ) {
        closeShareButton();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") closeShareButton();
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={shareButtonRef}>
      <button
        onClick={toggleShareButton}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
        aria-label="Share this post"
      >
        <Share2 size={size} />
      </button>
      {isOpen && <ShareDialog url={url} onClose={closeShareButton} />}
    </div>
  );
};

export default ShareButton;
