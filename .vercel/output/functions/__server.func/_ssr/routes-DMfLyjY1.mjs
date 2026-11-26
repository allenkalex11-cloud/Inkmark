import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as Slot, t as Label$1 } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as QrCode, r as Download } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DMfLyjY1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-fg/90",
			outline: "border border-border-strong bg-surface text-fg hover:bg-surface-sunken",
			ghost: "text-fg hover:bg-surface-sunken"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-10 px-3"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-fg", "placeholder:text-subtle", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
		className: cn("text-sm font-medium text-fg", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full resize-y rounded-md border border-border-strong bg-surface px-3 py-3 text-sm text-fg", "placeholder:text-subtle", className),
		...props
	});
}
var MAX_SIZE = 1024;
var HEX = /^#[0-9a-f]{6}$/;
function normalizeHex(input) {
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
function isHex(value) {
	return HEX.test(value);
}
function channel(hex, offset) {
	return Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
}
function linear(channelValue) {
	return channelValue <= .03928 ? channelValue / 12.92 : ((channelValue + .055) / 1.055) ** 2.4;
}
function contrastRatio(foreground, background) {
	const fg = normalizeHex(foreground) ?? "#000000";
	const bg = normalizeHex(background) ?? "#ffffff";
	const lum = (hex) => .2126 * linear(channel(hex, 1)) + .7152 * linear(channel(hex, 3)) + .0722 * linear(channel(hex, 5));
	const lighter = Math.max(lum(fg), lum(bg));
	const darker = Math.min(lum(fg), lum(bg));
	return (lighter + .05) / (darker + .05);
}
function friendlyQrError(error) {
	const message = error instanceof Error ? error.message : "";
	if (/too big|too long/i.test(message)) return "That text is too long for this error-correction level. Shorten it, or choose Low.";
	return "Could not build a code from that text.";
}
async function renderQr(text, options) {
	const symbol = import_lib.create(text, { errorCorrectionLevel: options.ec });
	const minimum = symbol.modules.size + 8;
	const pixels = Math.max(options.size, minimum);
	return {
		url: await import_lib.toDataURL(text, {
			errorCorrectionLevel: options.ec,
			margin: 4,
			width: pixels,
			color: {
				dark: `${options.foreground}ff`,
				light: `${options.background}ff`
			}
		}),
		pixels,
		version: symbol.version
	};
}
var STORAGE_KEY = "inkmark-settings";
var DEFAULTS = {
	text: "https://example.com",
	foreground: "#1c1c1e",
	background: "#fbfbf9",
	size: 512,
	ec: "M"
};
var LEVELS = [
	{
		id: "L",
		name: "Low",
		percent: "7%",
		detail: "Low recovers about 7% damage. The code stays smaller, with less room for wear."
	},
	{
		id: "M",
		name: "Medium",
		percent: "15%",
		detail: "Medium recovers about 15%. A solid default for screens and everyday print."
	},
	{
		id: "Q",
		name: "Quartile",
		percent: "25%",
		detail: "Quartile recovers about 25%. Use it when the code might get scuffed or partly covered."
	},
	{
		id: "H",
		name: "High",
		percent: "30%",
		detail: "High recovers about 30%. The code is larger, and the most resilient."
	}
];
var EXAMPLES = [
	{
		label: "Website",
		value: "https://example.com"
	},
	{
		label: "Note",
		value: "Meet at the north gate, 6pm."
	},
	{
		label: "Wi-Fi",
		value: "WIFI:T:WPA;S:Guest;P:password;;"
	}
];
var PRESETS = [
	{
		name: "Ink on paper",
		foreground: "#1c1c1e",
		background: "#fbfbf9"
	},
	{
		name: "Paper on ink",
		foreground: "#fbfbf9",
		background: "#1c1c1e"
	},
	{
		name: "Slate on mist",
		foreground: "#1e2a38",
		background: "#e7eef3"
	}
];
function loadSettings() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		const foreground = typeof data.foreground === "string" ? normalizeHex(data.foreground) : null;
		const background = typeof data.background === "string" ? normalizeHex(data.background) : null;
		const size = typeof data.size === "number" ? Math.min(MAX_SIZE, Math.max(160, Math.round(data.size / 16) * 16)) : null;
		const ec = data.ec === "L" || data.ec === "M" || data.ec === "Q" || data.ec === "H" ? data.ec : null;
		if (!foreground || !background || size === null || !ec || typeof data.text !== "string") return null;
		return {
			text: data.text,
			foreground,
			background,
			size,
			ec
		};
	} catch {
		return null;
	}
}
function downloadPng(dataUrl) {
	const link = document.createElement("a");
	link.href = dataUrl;
	link.download = "inkmark-qr.png";
	document.body.appendChild(link);
	link.click();
	link.remove();
}
function ColorField({ id, label, value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)(value);
	const hintId = `${id}-hint`;
	(0, import_react.useEffect)(() => {
		setDraft(value);
	}, [value]);
	const invalid = normalizeHex(draft) === null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: `${id}-hex`,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id,
					className: "swatch",
					type: "color",
					value: isHex(value) ? value : "#000000",
					"aria-label": `${label} picker`,
					onChange: (event) => onChange(event.target.value.toLowerCase())
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `${id}-hex`,
					value: draft,
					spellCheck: false,
					autoCapitalize: "off",
					autoCorrect: "off",
					maxLength: 7,
					"aria-invalid": invalid,
					"aria-describedby": hintId,
					onChange: (event) => {
						const next = event.target.value;
						setDraft(next);
						const normalized = normalizeHex(next);
						if (normalized) onChange(normalized);
					},
					onBlur: () => setDraft(value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: hintId,
				className: cn("text-xs", invalid ? "text-warn" : "text-subtle"),
				children: invalid ? "Use a hex color like #1c1c1e." : "Hex color"
			})
		]
	});
}
function QrStudio() {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULTS);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const statusId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		const saved = loadSettings();
		if (saved) setSettings(saved);
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	}, [settings, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!settings.text) {
			setResult(null);
			setError(null);
			setPending(false);
			return;
		}
		let cancelled = false;
		setPending(true);
		const timer = window.setTimeout(() => {
			(async () => {
				try {
					const next = await renderQr(settings.text, {
						ec: settings.ec,
						size: settings.size,
						foreground: settings.foreground,
						background: settings.background
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
	function update(patch) {
		setSettings((current) => ({
			...current,
			...patch
		}));
	}
	const level = LEVELS.find((item) => item.id === settings.ec) ?? LEVELS[1];
	const ratio = contrastRatio(settings.foreground, settings.background);
	const lowContrast = ratio < 3;
	const alt = settings.text ? `QR code for ${settings.text.slice(0, 120)}` : "Empty QR preview";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl leading-tight font-medium tracking-tight",
					children: "Inkmark"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: "A live QR code for a link or a line of text. Adjust it, then download a PNG."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]",
				onSubmit: (event) => event.preventDefault(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 lg:col-start-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "payload",
									children: "Text or URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-subtle tabular-nums",
									children: [settings.text.length, " characters"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "payload",
								value: settings.text,
								placeholder: "Paste a link or type a message",
								autoComplete: "off",
								spellCheck: false,
								onChange: (event) => update({ text: event.target.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-subtle",
										children: "Examples"
									}),
									EXAMPLES.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										"aria-pressed": settings.text === example.value,
										onClick: () => update({ text: example.value }),
										children: example.label
									}, example.label)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => update({ text: "" }),
										disabled: settings.text.length === 0,
										children: "Clear"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-panel lg:sticky lg:top-6 lg:col-start-2 lg:row-span-4 lg:row-start-1",
						"aria-label": "Preview",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto w-full max-w-64 lg:max-w-none",
								style: { backgroundColor: settings.background },
								children: result && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: result.url,
									alt,
									width: result.pixels,
									height: result.pixels,
									className: cn("h-auto w-full", pending && "opacity-70"),
									style: { imageRendering: "pixelated" }
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex aspect-square items-center justify-center border border-dashed border-border-strong bg-surface-sunken p-6 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										role: error ? "alert" : void 0,
										children: error ?? (pending ? "Generating…" : "Your code will appear here.")
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted tabular-nums",
										id: statusId,
										children: result && !error ? `Version ${result.version} · ${result.pixels} × ${result.pixels} px` : "No file yet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-subtle",
										children: "Quiet zone included. Scan it before you print."
									}),
									result && result.pixels !== settings.size ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-warn",
										children: [
											"This code is dense, so the file is ",
											result.pixels,
											" px to keep every module sharp."
										]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								className: "w-full",
								disabled: !result || pending || !!error,
								onClick: () => {
									if (result) downloadPng(result.url);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { "aria-hidden": "true" }), "Download PNG"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex flex-col gap-3 lg:col-start-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-sm font-medium",
								children: "Colors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
									id: "foreground",
									label: "Foreground",
									value: settings.foreground,
									onChange: (foreground) => update({ foreground })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
									id: "background",
									label: "Background",
									value: settings.background,
									onChange: (background) => update({ background })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								role: "group",
								"aria-label": "Color presets",
								children: PRESETS.map((preset) => {
									const selected = settings.foreground === preset.foreground && settings.background === preset.background;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: selected ? "default" : "outline",
										size: "sm",
										"aria-pressed": selected,
										onClick: () => update({
											foreground: preset.foreground,
											background: preset.background
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex",
											"aria-hidden": "true",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-3 border border-border-strong",
												style: { backgroundColor: preset.foreground }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-3 border border-border-strong",
												style: { backgroundColor: preset.background }
											})]
										}), preset.name]
									}, preset.name);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm tabular-nums", lowContrast ? "text-warn" : "text-subtle"),
								role: "status",
								children: lowContrast ? `Contrast is ${ratio.toFixed(1)}:1. Scanners usually need at least 3:1, so increase the difference between the two colors.` : `Contrast ${ratio.toFixed(1)}:1`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 lg:col-start-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "size",
									children: "Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm tabular-nums",
									children: [settings.size, " px"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "size",
								className: "size-range",
								type: "range",
								min: 160,
								max: MAX_SIZE,
								step: 16,
								value: settings.size,
								"aria-valuetext": `${settings.size} pixels`,
								"aria-describedby": "size-hint",
								onChange: (event) => update({ size: Number(event.target.value) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: "size-hint",
								className: "text-xs text-subtle",
								children: "Pixel size of the downloaded PNG. The preview on screen is scaled to fit."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex flex-col gap-3 lg:col-start-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-sm font-medium",
								children: "Error correction"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2",
								children: LEVELS.map((item) => {
									const checked = settings.ec === item.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: cn("choice flex h-14 flex-col items-center justify-center rounded-md border px-1 transition-colors duration-150", checked ? "border-accent bg-accent text-accent-fg" : "border-border-strong bg-surface text-fg hover:bg-surface-sunken"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "sr-only",
												type: "radio",
												name: "error-correction",
												value: item.id,
												checked,
												"aria-describedby": "ec-detail",
												onChange: () => update({ ec: item.id })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm leading-none font-medium",
												children: item.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("mt-1 text-xs leading-none tabular-nums", checked ? "text-accent-fg" : "text-muted"),
												children: item.percent
											})
										]
									}, item.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: "ec-detail",
								className: "text-sm text-muted",
								children: level.detail
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "Generated on this device. Nothing is uploaded."
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto min-h-dvh w-full max-w-5xl px-4 pb-16 pt-6 lg:px-8 lg:pt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrStudio, {})
	});
}
//#endregion
export { Home as component };
