import React, { useEffect, useState, useRef } from "react";
import { CardDesignConfig } from "../../types";
import { generateQrSvg } from "../../utils/qr";

interface CardPreviewProps {
  config: CardDesignConfig;
  interactiveTilt?: boolean;
  showBleedGuides?: boolean;
  showNfcAnimation?: boolean;
  showScanAnimation?: boolean;
  className?: string;
  onDownloadSvg?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  config,
  interactiveTilt = true,
  showBleedGuides = false,
  showNfcAnimation = false,
  showScanAnimation = false,
  className = "",
}) => {
  const [qrSvg, setQrSvg] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Generate genuine QR code whenever URL, colors, or qr style changes
  useEffect(() => {
    let isCancelled = false;
    const fetchQr = async () => {
      // Choose contrasting QR colors based on theme
      const darkColor = config.themeMode === "dark" ? "#FFFFFF" : "#17191D";
      const lightColor = config.themeMode === "dark" ? "#17191D" : "#FFFFFF";

      const svg = await generateQrSvg(config.googleReviewUrl, {
        width: 160,
        margin: 1,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });

      if (!isCancelled) {
        setQrSvg(svg);
      }
    };

    fetchQr();
    return () => {
      isCancelled = true;
    };
  }, [config.googleReviewUrl, config.themeMode, config.qrStyle]);

  // Subtle 3D mouse tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const isDark = config.themeMode === "dark";

  return (
    <div className={`relative perspective-1000 select-none ${className}`}>
      {/* 3D Tilt Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: interactiveTilt
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`
            : "none",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className="relative w-full max-w-[480px] aspect-[85.6/54] rounded-[16px] overflow-hidden shadow-2xl border border-black/10 transition-shadow duration-300"
      >
        {/* Card Background Layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: config.primaryColor,
            backgroundImage:
              config.templateId === "black-gold"
                ? "radial-gradient(ellipse at 80% 20%, rgba(255, 212, 71, 0.12) 0%, transparent 60%)"
                : `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
          }}
        />

        {/* Subtle Matte / Foil Sheen Reflection */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${tilt.y * 5 + 50}% ${-tilt.x * 5 + 50}%, rgba(255,255,255,0.8), transparent 70%)`
              : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)",
          }}
        />

        {/* 3mm Bleed & Safe Margin Production Guides (Print Overlay) */}
        {showBleedGuides && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* Bleed line (outer boundary) */}
            <div className="absolute inset-0 border border-red-500/60 border-dashed" />
            {/* Safe zone margin line (3mm from edge) */}
            <div className="absolute inset-[12px] border border-emerald-500/60 border-dashed rounded-[10px]">
              <span className="absolute top-1 left-2 text-[9px] font-mono text-emerald-600 bg-white/90 px-1 rounded">
                Safe Print Area (85.6 × 54mm)
              </span>
            </div>
          </div>
        )}

        {/* Card Content Interior */}
        <div
          className="relative z-10 w-full h-full p-6 sm:p-7 flex flex-col justify-between"
          style={{
            fontFamily: config.fontFamily,
            color: config.textColor,
          }}
        >
          {/* Header Bar: Business Logo / Name & NFC Icon */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {config.logoUrl ? (
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-sm border border-black/5 p-1 shadow-sm shrink-0"
                  style={{ transform: `scale(${config.logoScale})` }}
                >
                  <img
                    src={config.logoUrl}
                    alt={config.businessName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
                  style={{
                    backgroundColor: config.accentColor,
                    color: config.themeMode === "dark" && config.accentColor !== "#FFD447" ? "#FFFFFF" : "#17191D",
                  }}
                >
                  {config.businessName.charAt(0).toUpperCase() || "R"}
                </div>
              )}

              <div>
                <h3 className="font-bold text-base sm:text-lg leading-tight tracking-tight line-clamp-1">
                  {config.businessName || "Your Business Name"}
                </h3>
                <p className="text-xs opacity-75 font-medium line-clamp-1">
                  {config.tagline || "Your Feedback Makes Us Better."}
                </p>
              </div>
            </div>

            {/* NFC Wave Symbol */}
            {config.enableNfc && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shrink-0 shadow-sm"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.05)",
                  color: config.textColor,
                }}
              >
                {/* Contactless waves SVG */}
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                  <path d="M12 19a9 9 0 0 0 0-14" />
                  <path d="M15.5 21.5a13 13 0 0 0 0-19" />
                </svg>
                <span className="text-[11px] uppercase tracking-wider font-mono">NFC</span>
              </div>
            )}
          </div>

          {/* Center / Body Section: Callout, Rating Stars & Google Review Lockup */}
          <div className="flex items-end justify-between gap-4 my-auto pt-2">
            <div className="space-y-2 max-w-[210px] sm:max-w-[240px]">
              {/* Google Review Lockup */}
              {config.showGoogleLogo && (
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {/* Google 4-Color 'G' Icon */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="tracking-tight text-xs">Review us on Google</span>
                </div>
              )}

              {/* 5 Rating Stars */}
              {config.showRatingStars && (
                <div className="flex items-center gap-1 text-[#FBBC05]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-4 h-4 fill-current drop-shadow-sm"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-[11px] font-mono font-bold ml-1 text-current">5.0</span>
                </div>
              )}

              <p className="text-xs sm:text-sm font-semibold opacity-90 leading-tight">
                {config.subText || "Tap with your phone or scan to review"}
              </p>
            </div>

            {/* QR Code Container with quiet zone */}
            {config.enableQr && (
              <div className="relative shrink-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 p-1.5 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-black/5"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />

                {/* Simulated scan reticle when scanner animation is triggered */}
                {showScanAnimation && (
                  <div className="absolute -inset-1 rounded-xl border-2 border-[#2864F0] animate-pulse pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#2864F0] animate-bounce shadow-sm" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar: Discreet Serial / Authentic Quality Stamp */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono opacity-60 pt-1 border-t border-current/10">
            <span>ReviewTap ISO/IEC 7810</span>
            <span>NTAG213 13.56 MHz</span>
          </div>
        </div>

        {/* Contactless Tap Pulse Animation Overlay */}
        {showNfcAnimation && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="absolute w-24 h-24 rounded-full border-4 border-[#2864F0]/60 animate-ping" />
            <div className="absolute w-40 h-40 rounded-full border-2 border-[#7556E8]/40 animate-pulse" />
            <div className="bg-[#123B2B] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              NFC Tap Detected!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
