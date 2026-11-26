import * as QRCode from "qrcode";

export type ErrorCorrection = "L" | "M" | "Q" | "H";

export const QUIET_ZONE = 4;
export const MIN_SIZE = 160;
export const MAX_SIZE = 1024;
export const SIZE_STEP = 16;

export type QrRender = {
  url: string;
  pixels: number;
  version: number;
};

const HEX = /^#[0-9a-f]{6}$/;

export function normalizeHex(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (!value.startsWith("#")) value = `#${value}`;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toLowerCase();
  return null;
}

export function isHex(value: string): boolean {
  return HEX.test(value);
}

function channel(hex: string, offset: number): number {
  return Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
}

function linear(channelValue: number): number {
  return channelValue <= 0.03928
    ? channelValue / 12.92
    : ((channelValue + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = normalizeHex(foreground) ?? "#000000";
  const bg = normalizeHex(background) ?? "#ffffff";
  const lum = (hex: string) =>
    0.2126 * linear(channel(hex, 1)) +
    0.7152 * linear(channel(hex, 3)) +
    0.0722 * linear(channel(hex, 5));
  const lighter = Math.max(lum(fg), lum(bg));
  const darker = Math.min(lum(fg), lum(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

export function friendlyQrError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/too big|too long/i.test(message)) {
    return "That text is too long for this error-correction level. Shorten it, or choose Low.";
  }
  return "Could not build a code from that text.";
}

export async function renderQr(
  text: string,
  options: { ec: ErrorCorrection; size: number; foreground: string; background: string },
): Promise<QrRender> {
  const symbol = QRCode.create(text, { errorCorrectionLevel: options.ec });
  const minimum = symbol.modules.size + QUIET_ZONE * 2;
  const pixels = Math.max(options.size, minimum);
  const url = await QRCode.toDataURL(text, {
    errorCorrectionLevel: options.ec,
    margin: QUIET_ZONE,
    width: pixels,
    color: {
      dark: `${options.foreground}ff`,
      light: `${options.background}ff`,
    },
  });
  return { url, pixels, version: symbol.version };
}
