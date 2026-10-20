import React, { useState } from "react";
import { BRAND_CONFIG } from "../../config/brand";

interface AnnouncementBarProps {
  onOpenCustomizer?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenCustomizer }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !BRAND_CONFIG.announcement.enabled) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#123B2B] text-white text-xs py-2 px-4 transition-all border-b border-emerald-950/40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-medium truncate flex items-center justify-center gap-2">
          <span>{BRAND_CONFIG.announcement.text}</span>
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="underline hover:text-emerald-300 font-semibold cursor-pointer shrink-0"
            >
              {BRAND_CONFIG.announcement.linkText} →
            </button>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-white/60 hover:text-white transition-colors text-base leading-none p-1 shrink-0"
        >
          ×
        </button>
      </div>
    </aside>
  );
};
