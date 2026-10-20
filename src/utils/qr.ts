import QRCode from "qrcode";

export interface QROptions {
  color?: {
    dark?: string;
    light?: string;
  };
  margin?: number;
  width?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Validates whether a given URL is a legitimate review destination
 */
export function validateDestinationUrl(url: string): { valid: boolean; message: string } {
  if (!url || url.trim() === "") {
    return { valid: false, message: "URL cannot be empty" };
  }

  const trimmed = url.trim();

  // Must begin with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return { valid: false, message: "URL must begin with https:// or http://" };
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();

    // Check for Google review link formats or general safe business links
    const isGoogle =
      hostname.includes("google.com") ||
      hostname.includes("g.page") ||
      hostname.includes("maps.app.goo.gl") ||
      hostname.includes("search.google.com");

    if (isGoogle) {
      return { valid: true, message: "Verified Google Maps / Review Link format" };
    }

    return { valid: true, message: "Valid custom destination URL" };
  } catch {
    return { valid: false, message: "Invalid URL format" };
  }
}

/**
 * Generates an SVG string representation of a genuine QR code
 */
export async function generateQrSvg(
  text: string,
  options: QROptions = {}
): Promise<string> {
  const safeText = text && text.trim() ? text.trim() : "https://g.page/r/reviewtap";
  try {
    const svg = await QRCode.toString(safeText, {
      type: "svg",
      margin: options.margin ?? 2,
      width: options.width ?? 200,
      color: {
        dark: options.color?.dark ?? "#17191D",
        light: options.color?.light ?? "#FFFFFF",
      },
      errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    });
    return svg;
  } catch (err) {
    console.error("Failed to generate QR SVG", err);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f1f5f9"/><text x="50" y="55" font-size="8" text-anchor="middle" fill="#64748b">QR Error</text></svg>`;
  }
}

/**
 * Generates a Data URL (base64 PNG) of the genuine QR code
 */
export async function generateQrDataUrl(
  text: string,
  options: QROptions = {}
): Promise<string> {
  const safeText = text && text.trim() ? text.trim() : "https://g.page/r/reviewtap";
  try {
    const dataUrl = await QRCode.toDataURL(safeText, {
      margin: options.margin ?? 2,
      width: options.width ?? 300,
      color: {
        dark: options.color?.dark ?? "#17191D",
        light: options.color?.light ?? "#FFFFFF",
      },
      errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    });
    return dataUrl;
  } catch (err) {
    console.error("Failed to generate QR data URL", err);
    return "";
  }
}
