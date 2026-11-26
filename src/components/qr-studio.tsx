import { useEffect, useId, useState } from "react";
import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contrastRatio,
  friendlyQrError,
  isHex,
  MAX_SIZE,
  MIN_SIZE,
  normalizeHex,
  renderQr,
  SIZE_STEP,
  type ErrorCorrection,
  type QrRender,
} from "@/lib/qr";
import { cn } from "@/lib/utils";

type Settings = {
  text: string;
  foreground: string;
  background: string;
  size: number;
  ec: ErrorCorrection;
};

const STORAGE_KEY = "inkmark-settings";

const DEFAULTS: Settings = {
  text: "https://example.com",
  foreground: "#1c1c1e",
  background: "#fbfbf9",
  size: 512,
  ec: "M",
};

const LEVELS: { id: ErrorCorrection; name: string; percent: string; detail: string }[] = [
  {
    id: "L",
    name: "Low",
    percent: "7%",
    detail: "Low recovers about 7% damage. The code stays smaller, with less room for wear.",
  },
  {
    id: "M",
    name: "Medium",
    percent: "15%",
    detail: "Medium recovers about 15%. A solid default for screens and everyday print.",
  },
  {
    id: "Q",
    name: "Quartile",
    percent: "25%",
    detail: "Quartile recovers about 25%. Use it when the code might get scuffed or partly covered.",
  },
  {
    id: "H",
    name: "High",
    percent: "30%",
    detail: "High recovers about 30%. The code is larger, and the most resilient.",
  },
];

const EXAMPLES: { label: string; value: string }[] = [
  { label: "Website", value: "https://example.com" },
  { label: "Note", value: "Meet at the north gate, 6pm." },
  { label: "Wi-Fi", value: "WIFI:T:WPA;S:Guest;P:password;;" },
];

const PRESETS: { name: string; foreground: string; background: string }[] = [
  { name: "Ink on paper", foreground: "#1c1c1e", background: "#fbfbf9" },
  { name: "Paper on ink", foreground: "#fbfbf9", background: "#1c1c1e" },
  { name: "Slate on mist", foreground: "#1e2a38", background: "#e7eef3" },
];

function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Settings>;
    const foreground = typeof data.foreground === "string" ? normalizeHex(data.foreground) : null;
    const background = typeof data.background === "string" ? normalizeHex(data.background) : null;
    const size =
      typeof data.size === "number"
        ? Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(data.size / SIZE_STEP) * SIZE_STEP))
        : null;
    const ec = data.ec === "L" || data.ec === "M" || data.ec === "Q" || data.ec === "H" ? data.ec : null;
    if (!foreground || !background || size === null || !ec || typeof data.text !== "string") return null;
    return { text: data.text, foreground, background, size, ec };
  } catch {
    return null;
  }
}

function downloadPng(dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "inkmark-qr.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const hintId = `${id}-hint`;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const invalid = normalizeHex(draft) === null;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${id}-hex`}>{label}</Label>
      <div className="flex gap-2">
        <input
          id={id}
          className="swatch"
          type="color"
          value={isHex(value) ? value : "#000000"}
          aria-label={`${label} picker`}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
        />
        <Input
          id={`${id}-hex`}
          value={draft}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          maxLength={7}
          aria-invalid={invalid}
          aria-describedby={hintId}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            const normalized = normalizeHex(next);
            if (normalized) onChange(normalized);
          }}
          onBlur={() => setDraft(value)}
        />
      </div>
      <p id={hintId} className={cn("text-xs", invalid ? "text-warn" : "text-subtle")}>
        {invalid ? "Use a hex color like #1c1c1e." : "Hex color"}
      </p>
    </div>
  );
}

export function QrStudio() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [result, setResult] = useState<QrRender | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const statusId = useId();

  useEffect(() => {
    const saved = loadSettings();
    if (saved) setSettings(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (!settings.text) {
      setResult(null);
      setError(null);
      setPending(false);
      return;
    }

    let cancelled = false;
    setPending(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const next = await renderQr(settings.text, {
            ec: settings.ec,
            size: settings.size,
            foreground: settings.foreground,
            background: settings.background,
          });
          if (cancelled) return;
          setResult(next);
          setError(null);
        } catch (err) {
          if (cancelled) return;
          setResult(null);
          setError(friendlyQrError(err));
        } finally {
          if (!cancelled) setPending(false);
        }
      })();
    }, 40);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [settings]);

  function update(patch: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  const level = LEVELS.find((item) => item.id === settings.ec) ?? LEVELS[1];
  const ratio = contrastRatio(settings.foreground, settings.background);
  const lowContrast = ratio < 3;
  const alt = settings.text
    ? `QR code for ${settings.text.slice(0, 120)}`
    : "Empty QR preview";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface"
          aria-hidden="true"
        >
          <QrCode className="size-5" />
        </span>
        <div>
          <h1 className="font-display text-xl leading-tight font-medium tracking-tight">Inkmark</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            A live QR code for a link or a line of text. Adjust it, then download a PNG.
          </p>
        </div>
      </header>

      <form
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-2 lg:col-start-1">
          <div className="flex items-end justify-between gap-3">
            <Label htmlFor="payload">Text or URL</Label>
            <span className="text-xs text-subtle tabular-nums">{settings.text.length} characters</span>
          </div>
          <Textarea
            id="payload"
            value={settings.text}
            placeholder="Paste a link or type a message"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => update({ text: event.target.value })}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-subtle">Examples</span>
            {EXAMPLES.map((example) => (
              <Button
                key={example.label}
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={settings.text === example.value}
                onClick={() => update({ text: example.value })}
              >
                {example.label}
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => update({ text: "" })}
              disabled={settings.text.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>

        <aside
          className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-panel lg:sticky lg:top-6 lg:col-start-2 lg:row-span-4 lg:row-start-1"
          aria-label="Preview"
        >
          <div
            className="mx-auto w-full max-w-64 lg:max-w-none"
            style={{ backgroundColor: settings.background }}
          >
            {result && !error ? (
              <img
                src={result.url}
                alt={alt}
                width={result.pixels}
                height={result.pixels}
                className={cn("h-auto w-full", pending && "opacity-70")}
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <div className="flex aspect-square items-center justify-center border border-dashed border-border-strong bg-surface-sunken p-6 text-center">
                <p className="text-sm text-muted" role={error ? "alert" : undefined}>
                  {error ?? (pending ? "Generating…" : "Your code will appear here.")}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 text-center">
            <p className="text-sm text-muted tabular-nums" id={statusId}>
              {result && !error
                ? `Version ${result.version} · ${result.pixels} × ${result.pixels} px`
                : "No file yet"}
            </p>
            <p className="text-xs text-subtle">Quiet zone included. Scan it before you print.</p>
            {result && result.pixels !== settings.size ? (
              <p className="text-xs text-warn">
                This code is dense, so the file is {result.pixels} px to keep every module sharp.
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={!result || pending || !!error}
            onClick={() => {
              if (result) downloadPng(result.url);
            }}
          >
            <Download aria-hidden="true" />
            Download PNG
          </Button>
        </aside>

        <fieldset className="flex flex-col gap-3 lg:col-start-1">
          <legend className="text-sm font-medium">Colors</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="foreground"
              label="Foreground"
              value={settings.foreground}
              onChange={(foreground) => update({ foreground })}
            />
            <ColorField
              id="background"
              label="Background"
              value={settings.background}
              onChange={(background) => update({ background })}
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Color presets">
            {PRESETS.map((preset) => {
              const selected =
                settings.foreground === preset.foreground && settings.background === preset.background;
              return (
                <Button
                  key={preset.name}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  aria-pressed={selected}
                  onClick={() =>
                    update({ foreground: preset.foreground, background: preset.background })
                  }
                >
                  <span className="flex" aria-hidden="true">
                    <span
                      className="size-3 border border-border-strong"
                      style={{ backgroundColor: preset.foreground }}
                    />
                    <span
                      className="size-3 border border-border-strong"
                      style={{ backgroundColor: preset.background }}
                    />
                  </span>
                  {preset.name}
                </Button>
              );
            })}
          </div>
          <p className={cn("text-sm tabular-nums", lowContrast ? "text-warn" : "text-subtle")} role="status">
            {lowContrast
              ? `Contrast is ${ratio.toFixed(1)}:1. Scanners usually need at least 3:1, so increase the difference between the two colors.`
              : `Contrast ${ratio.toFixed(1)}:1`}
          </p>
        </fieldset>

        <div className="flex flex-col gap-2 lg:col-start-1">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="size">Size</Label>
            <span className="text-sm tabular-nums">{settings.size} px</span>
          </div>
          <input
            id="size"
            className="size-range"
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            step={SIZE_STEP}
            value={settings.size}
            aria-valuetext={`${settings.size} pixels`}
            aria-describedby="size-hint"
            onChange={(event) => update({ size: Number(event.target.value) })}
          />
          <p id="size-hint" className="text-xs text-subtle">
            Pixel size of the downloaded PNG. The preview on screen is scaled to fit.
          </p>
        </div>

        <fieldset className="flex flex-col gap-3 lg:col-start-1">
          <legend className="text-sm font-medium">Error correction</legend>
          <div className="grid grid-cols-4 gap-2">
            {LEVELS.map((item) => {
              const checked = settings.ec === item.id;
              return (
                <label
                  key={item.id}
                  className={cn(
                    "choice flex h-14 flex-col items-center justify-center rounded-md border px-1 transition-colors duration-150",
                    checked
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border-strong bg-surface text-fg hover:bg-surface-sunken",
                  )}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="error-correction"
                    value={item.id}
                    checked={checked}
                    aria-describedby="ec-detail"
                    onChange={() => update({ ec: item.id })}
                  />
                  <span className="text-sm leading-none font-medium">{item.name}</span>
                  <span
                    className={cn(
                      "mt-1 text-xs leading-none tabular-nums",
                      checked ? "text-accent-fg" : "text-muted",
                    )}
                  >
                    {item.percent}
                  </span>
                </label>
              );
            })}
          </div>
          <p id="ec-detail" className="text-sm text-muted">
            {level.detail}
          </p>
        </fieldset>
      </form>

      <p className="text-xs text-subtle">Generated on this device. Nothing is uploaded.</p>
    </div>
  );
}
