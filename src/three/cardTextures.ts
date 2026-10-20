import * as THREE from "three";
import { CardDesignConfig } from "../types";
import { generateQrDataUrl } from "../utils/qr";

/**
 * Procedurally generates a high-resolution 1024x640 front card texture
 */
export async function createCardFrontTexture(
  config: CardDesignConfig,
  anisotropy = 8
): Promise<THREE.CanvasTexture> {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 646; // matches 85.6 / 54 ratio
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Draw background gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, config.primaryColor);
  grad.addColorStop(1, config.secondaryColor || config.primaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle luxury sheen / texture grain
  if (config.templateId === "black-gold") {
    const radial = ctx.createRadialGradient(
      canvas.width * 0.8,
      canvas.height * 0.2,
      20,
      canvas.width * 0.8,
      canvas.height * 0.2,
      canvas.width * 0.6
    );
    radial.addColorStop(0, "rgba(255, 212, 71, 0.15)");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const isDark = config.themeMode === "dark";

  // Business Logo or Monogram
  const logoSize = 80 * (config.logoScale || 1);
  if (config.logoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = config.logoUrl!;
      });
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.roundRect(60, 60, logoSize, logoSize, 16);
        ctx.fill();
        ctx.drawImage(img, 65, 65, logoSize - 10, logoSize - 10);
        ctx.restore();
      }
    } catch {
      // Fallback to monogram
    }
  } else {
    ctx.save();
    ctx.fillStyle = config.accentColor;
    ctx.beginPath();
    ctx.roundRect(60, 60, 76, 76, 16);
    ctx.fill();
    ctx.fillStyle = isDark && config.accentColor !== "#FFD447" ? "#FFFFFF" : "#17191D";
    ctx.font = "bold 40px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((config.businessName.charAt(0) || "R").toUpperCase(), 60 + 38, 60 + 40);
    ctx.restore();
  }

  // Business Name & Tagline
  ctx.save();
  ctx.fillStyle = config.textColor;
  ctx.font = `bold 34px '${config.fontFamily}', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(config.businessName || "Your Business Name", 160, 95);

  ctx.font = `500 20px '${config.fontFamily}', sans-serif`;
  ctx.globalAlpha = 0.75;
  ctx.fillText(config.tagline || "Your Feedback Makes Us Better.", 160, 130);
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // Contactless NFC symbol on top-right
  if (config.enableNfc) {
    ctx.save();
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)";
    ctx.beginPath();
    ctx.roundRect(canvas.width - 160, 60, 100, 44, 22);
    ctx.fill();

    ctx.strokeStyle = config.textColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Waves
    const cx = canvas.width - 125;
    const cy = 82;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 15, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

    ctx.fillStyle = config.textColor;
    ctx.font = "bold 14px monospace";
    ctx.fillText("NFC", canvas.width - 100, 87);
    ctx.restore();
  }

  // Middle section: Google review lockup, stars, instruction text
  ctx.save();
  ctx.fillStyle = config.textColor;

  if (config.showGoogleLogo) {
    ctx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Review us on Google", 60, 320);
  }

  if (config.showRatingStars) {
    ctx.fillStyle = "#FBBC05";
    for (let s = 0; s < 5; s++) {
      drawStar(ctx, 60 + s * 30 + 12, 360, 5, 12, 6);
    }
    ctx.fillStyle = config.textColor;
    ctx.font = "bold 18px monospace";
    ctx.fillText("5.0", 225, 366);
  }

  ctx.fillStyle = config.textColor;
  ctx.font = `600 22px '${config.fontFamily}', sans-serif`;
  ctx.globalAlpha = 0.9;
  ctx.fillText(config.subText || "Tap with your phone or scan to review", 60, 420);
  ctx.restore();

  // QR Code Area
  if (config.enableQr) {
    try {
      const qrDataUrl = await generateQrDataUrl(config.googleReviewUrl, {
        width: 220,
        margin: 1,
        color: {
          dark: isDark ? "#FFFFFF" : "#17191D",
          light: isDark ? "#17191D" : "#FFFFFF",
        },
      });

      if (qrDataUrl) {
        const qrImg = new Image();
        await new Promise<void>((resolve) => {
          qrImg.onload = () => resolve();
          qrImg.onerror = () => resolve();
          qrImg.src = qrDataUrl;
        });

        if (qrImg.complete && qrImg.naturalWidth > 0) {
          const qrX = canvas.width - 270;
          const qrY = canvas.height - 290;
          const qrSize = 210;

          // White quiet zone backing
          ctx.save();
          ctx.fillStyle = isDark ? "#17191D" : "#FFFFFF";
          ctx.beginPath();
          ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 16);
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.1)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          ctx.restore();
        }
      }
    } catch (e) {
      console.error("QR draw error", e);
    }
  }

  // Footer subtle stamp
  ctx.save();
  ctx.fillStyle = config.textColor;
  ctx.globalAlpha = 0.45;
  ctx.font = "14px monospace";
  ctx.fillText("ReviewTap ISO/IEC 7810 · High-Frequency Contactless", 60, 580);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates the reverse side texture with NFC antenna circuitry traces
 */
export function createCardBackTexture(
  config: CardDesignConfig,
  anisotropy = 8
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 646;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = config.primaryColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle NFC coil antenna lines
  ctx.save();
  ctx.strokeStyle =
    config.themeMode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
  ctx.lineWidth = 3;

  for (let r = 0; r < 5; r++) {
    const pad = 40 + r * 14;
    ctx.beginPath();
    ctx.roundRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2, 24);
    ctx.stroke();
  }

  // Central microchip representation
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  ctx.fillStyle =
    config.themeMode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  ctx.beginPath();
  ctx.roundRect(cx - 35, cy - 35, 70, 70, 12);
  ctx.fill();

  ctx.fillStyle = config.textColor;
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "center";
  ctx.fillText("NTAG213", cx, cy + 5);

  ctx.font = "14px monospace";
  ctx.globalAlpha = 0.6;
  ctx.fillText("TAP REVERSE SIDE WITH ANY PHONE", cx, cy + 80);
  ctx.fillText("www.reviewtap.in", cx, canvas.height - 60);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates soft contact shadow texture for grounding the 3D card
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const rad = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
    rad.addColorStop(0, "rgba(17, 17, 20, 0.45)");
    rad.addColorStop(0.5, "rgba(17, 17, 20, 0.18)");
    rad.addColorStop(1, "transparent");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
