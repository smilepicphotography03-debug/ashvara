"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("announcementBarDismissed") !== "true") {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("announcementBarDismissed", "true");
    } catch (e) {
      console.error("Session storage is not available.", e);
    }
  };

  if (!isVisible) {
    return null;
  }

  const marqueeKeyframes = `
        @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
    `;

  const messages = [
    { text: "Opening Video is Must For Any Claims", isBold: true },
    { text: "Minimum Order Value ₹200", isBold: false },
    { text: "Free Shipping for orders above ₹2000", isBold: false },
  ];

  const MarqueeItem = ({ text, isBold }: { text: string; isBold: boolean }) => (
    <div className="px-6">
      <span className="text-xs font-medium whitespace-nowrap">
        {isBold ? <strong>{text}</strong> : text}
      </span>
    </div>
  );

  return (
    <>
      <style>{marqueeKeyframes}</style>
      <aside className="bg-primary text-primary-foreground" aria-label="Announcement">
        <div className="container">
          <div className="flex items-center justify-between h-10">
            <div className="flex-1 overflow-hidden relative h-full">
              <div
                className="group absolute top-0 left-0 flex items-center"
                style={{ animation: "marquee 30s linear infinite" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.animationPlayState = "paused")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.animationPlayState = "running")
                }
              >
                <div className="flex items-center">
                  {messages.map((msg, i) => (
                    <MarqueeItem key={`part1-${i}`} {...msg} />
                  ))}
                </div>
                <div className="flex items-center" aria-hidden="true">
                  {messages.map((msg, i) => (
                    <MarqueeItem key={`part2-${i}`} {...msg} />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 flex-shrink-0 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AnnouncementBar;