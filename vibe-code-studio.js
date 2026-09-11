(() => {
  "use strict";

  const SIZE = 1080;
  const FONT_READING = '"Faculty Glyphic", Georgia, serif';
  const FONT_INTERFACE = '"VT323", monospace';
  const BRAND_MARK_URL = "./assets/brand/logo-mark-signal.svg?v=20260911-flyer-v2";
  const COLORS = {
    charcoal: "#2f3035",
    charcoalDeep: "#22242a",
    cream: "#f3e9c4",
    orange: "#fa622e",
    pink: "#f45077",
    teal: "#0f8fb1",
    yellow: "#f8d23d"
  };
  const DEFAULTS = {
    layout: "signal",
    accent: COLORS.orange
  };

  const view = document.querySelector("#shareView");
  const form = document.querySelector("#vibeCodeForm");
  const canvas = document.querySelector("#vibeCodeCanvas");
  const destinationInput = document.querySelector("#vibeCodeDestination");
  const status = document.querySelector("#vibeCodeStatus");
  if (!view || !form || !(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;

  const qrCanvas = document.createElement("canvas");
  const brandMark = new Image();
  brandMark.decoding = "async";
  const studio = {
    layout: DEFAULTS.layout,
    accent: DEFAULTS.accent,
    renderRequest: 0,
    renderTimer: 0,
    currentDestination: ""
  };

  function fieldValue(name, fallback = "") {
    const field = form.elements.namedItem(name);
    return String(field?.value || fallback).trim();
  }

  function normalizeDestination(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) throw new Error("Add a destination to generate your Vibe Code.");
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    let parsed;
    try {
      parsed = new URL(candidate);
    } catch {
      throw new Error("Enter a complete website or link.");
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Use an http or https destination.");
    }
    return parsed.href;
  }

  function destinationLabel(destination) {
    try {
      const parsed = new URL(destination);
      const host = parsed.hostname.replace(/^www\./i, "");
      const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
      const label = `${host}${path}`;
      return label.length > 48 ? `${label.slice(0, 45)}...` : label;
    } catch {
      return destination;
    }
  }

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function rgba(hex, alpha) {
    const normalized = String(hex).replace("#", "").padEnd(6, "0").slice(0, 6);
    const value = Number.parseInt(normalized, 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }

  function contrastColor(hex) {
    const normalized = String(hex).replace("#", "").padEnd(6, "0").slice(0, 6);
    const value = Number.parseInt(normalized, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? COLORS.charcoalDeep : COLORS.cream;
  }

  function setFont(size, weight = 700, family = FONT_READING) {
    context.font = `${weight} ${size}px ${family}`;
  }

  function splitLongWord(word, maxWidth) {
    const chunks = [];
    let chunk = "";
    [...word].forEach((character) => {
      const next = chunk + character;
      if (chunk && context.measureText(next).width > maxWidth) {
        chunks.push(chunk);
        chunk = character;
      } else {
        chunk = next;
      }
    });
    if (chunk) chunks.push(chunk);
    return chunks;
  }

  function wrapLines(text, maxWidth) {
    const source = String(text || "").replace(/\s+/g, " ").trim();
    if (!source) return [""];
    const words = source.split(" ").flatMap((word) => context.measureText(word).width > maxWidth
      ? splitLongWord(word, maxWidth)
      : [word]);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function fittedText(text, options) {
    let size = options.startSize;
    let lines = [];
    while (size >= options.minSize) {
      setFont(size, options.weight, options.family);
      lines = wrapLines(text, options.maxWidth);
      if (lines.length <= options.maxLines) break;
      size -= 2;
    }
    if (lines.length > options.maxLines) {
      lines = lines.slice(0, options.maxLines);
      let last = lines.at(-1);
      while (last && context.measureText(`${last}...`).width > options.maxWidth) last = last.slice(0, -1).trim();
      lines[lines.length - 1] = `${last}...`;
    }
    context.fillStyle = options.color;
    context.textAlign = options.align || "left";
    context.textBaseline = "top";
    setFont(size, options.weight, options.family);
    const lineHeight = size * (options.lineHeight || 1.05);
    lines.forEach((line, index) => context.fillText(line, options.x, options.y + index * lineHeight));
    return options.y + lines.length * lineHeight;
  }

  function drawSingleLine(text, options) {
    let size = options.startSize;
    while (size > options.minSize) {
      setFont(size, options.weight, options.family);
      if (context.measureText(text).width <= options.maxWidth) break;
      size -= 1;
    }
    context.fillStyle = options.color;
    context.textAlign = options.align || "left";
    context.textBaseline = options.baseline || "top";
    setFont(size, options.weight, options.family);
    context.fillText(text, options.x, options.y, options.maxWidth);
  }

  function drawBrand(x, y, size, textColor, accent) {
    if (brandMark.complete && brandMark.naturalWidth > 0) {
      context.drawImage(brandMark, x, y, size, size);
    } else {
      context.fillStyle = accent;
      context.fillRect(x, y, size, size);
      drawSingleLine("VQ", {
        x: x + size / 2,
        y: y + size / 2,
        maxWidth: size * 0.8,
        startSize: size * 0.42,
        minSize: size * 0.3,
        weight: 700,
        family: FONT_INTERFACE,
        color: contrastColor(accent),
        align: "center",
        baseline: "middle"
      });
    }
    drawSingleLine("VIBE CODE / REAL-WORLD DISCOVERY", {
      x: x + size + 28,
      y: y + 28,
      maxWidth: 650,
      startSize: 28,
      minSize: 20,
      weight: 700,
      family: FONT_INTERFACE,
      color: accent
    });
    drawSingleLine("VIBE QUEST", {
      x: x + size + 28,
      y: y + 66,
      maxWidth: 650,
      startSize: 22,
      minSize: 16,
      weight: 700,
      family: FONT_INTERFACE,
      color: textColor
    });
  }

  function drawPixelSpark(x, y, size, color) {
    const unit = Math.max(4, Math.round(size / 5));
    context.fillStyle = color;
    context.fillRect(x - unit / 2, y - size / 2, unit, size);
    context.fillRect(x - size / 2, y - unit / 2, size, unit);
    context.fillRect(x - unit * 1.5, y - unit * 1.5, unit, unit);
    context.fillRect(x + unit * 0.5, y + unit * 0.5, unit, unit);
  }

  function drawQrFrame(x, y, size, qr, accent) {
    context.fillStyle = rgba(COLORS.charcoalDeep, 0.42);
    context.fillRect(x + 18, y + 18, size, size);
    context.fillStyle = accent;
    context.fillRect(x - 12, y - 12, size + 24, size + 24);
    context.drawImage(qr, x, y, size, size);

    const corner = 58;
    const stroke = 10;
    context.fillStyle = accent;
    context.fillRect(x - 26, y - 26, corner, stroke);
    context.fillRect(x - 26, y - 26, stroke, corner);
    context.fillRect(x + size - corner + 26, y - 26, corner, stroke);
    context.fillRect(x + size + 16, y - 26, stroke, corner);
    context.fillRect(x - 26, y + size + 16, corner, stroke);
    context.fillRect(x - 26, y + size - corner + 26, stroke, corner);
    context.fillRect(x + size - corner + 26, y + size + 16, corner, stroke);
    context.fillRect(x + size + 16, y + size - corner + 26, stroke, corner);
  }

  function drawSignalLayout(copy, qr) {
    const accent = studio.accent;
    context.fillStyle = COLORS.charcoal;
    context.fillRect(0, 0, SIZE, SIZE);
    context.fillStyle = accent;
    context.fillRect(0, 0, 24, SIZE);

    context.strokeStyle = rgba(COLORS.cream, 0.065);
    context.lineWidth = 2;
    for (let offset = -SIZE; offset < SIZE * 2; offset += 70) {
      context.beginPath();
      context.moveTo(offset, 0);
      context.lineTo(offset + SIZE, SIZE);
      context.stroke();
    }

    drawBrand(58, 46, 122, COLORS.cream, accent);
    fittedText(copy.title, {
      x: 66,
      y: 250,
      maxWidth: 330,
      maxLines: 4,
      startSize: 70,
      minSize: 48,
      lineHeight: 0.98,
      weight: 700,
      family: FONT_READING,
      color: COLORS.cream
    });
    fittedText(copy.prompt, {
      x: 70,
      y: 625,
      maxWidth: 320,
      maxLines: 3,
      startSize: 32,
      minSize: 24,
      lineHeight: 1.12,
      weight: 700,
      family: FONT_INTERFACE,
      color: accent
    });
    drawPixelSpark(116, 820, 54, accent);
    drawPixelSpark(216, 850, 28, COLORS.cream);
    drawPixelSpark(322, 804, 38, accent);

    drawQrFrame(460, 230, 556, qr, accent);
    drawSingleLine("SCAN THE SIGNAL", {
      x: 738,
      y: 818,
      maxWidth: 530,
      startSize: 30,
      minSize: 22,
      weight: 700,
      family: FONT_INTERFACE,
      color: COLORS.cream,
      align: "center"
    });

    context.fillStyle = accent;
    context.fillRect(0, 930, SIZE, 150);
    drawSingleLine(copy.destinationLabel.toUpperCase(), {
      x: 64,
      y: 978,
      maxWidth: 850,
      startSize: 31,
      minSize: 21,
      weight: 700,
      family: FONT_INTERFACE,
      color: contrastColor(accent)
    });
    drawPixelSpark(992, 1006, 46, contrastColor(accent));
  }

  function drawPortalLayout(copy, qr) {
    const accent = studio.accent;
    context.fillStyle = COLORS.cream;
    context.fillRect(0, 0, SIZE, SIZE);
    context.fillStyle = accent;
    context.fillRect(0, 0, SIZE, 24);
    context.fillRect(0, SIZE - 24, SIZE, 24);

    drawBrand(54, 44, 108, COLORS.charcoalDeep, accent);
    fittedText(copy.title, {
      x: SIZE / 2,
      y: 175,
      maxWidth: 900,
      maxLines: 2,
      startSize: 67,
      minSize: 46,
      lineHeight: 0.98,
      weight: 700,
      family: FONT_READING,
      color: COLORS.charcoalDeep,
      align: "center"
    });

    drawQrFrame(270, 345, 540, qr, accent);
    drawPixelSpark(112, 420, 46, accent);
    drawPixelSpark(950, 526, 32, COLORS.charcoalDeep);
    drawPixelSpark(132, 790, 30, COLORS.charcoalDeep);
    drawPixelSpark(930, 844, 52, accent);
    drawSingleLine(copy.prompt.toUpperCase(), {
      x: SIZE / 2,
      y: 928,
      maxWidth: 860,
      startSize: 32,
      minSize: 21,
      weight: 700,
      family: FONT_INTERFACE,
      color: accent,
      align: "center"
    });
    drawSingleLine(copy.destinationLabel.toUpperCase(), {
      x: SIZE / 2,
      y: 982,
      maxWidth: 850,
      startSize: 25,
      minSize: 18,
      weight: 700,
      family: FONT_INTERFACE,
      color: COLORS.charcoalDeep,
      align: "center"
    });
  }

  function drawInvalidState(message) {
    context.fillStyle = COLORS.charcoal;
    context.fillRect(0, 0, SIZE, SIZE);
    context.fillStyle = studio.accent;
    context.fillRect(0, 0, 24, SIZE);
    drawBrand(58, 46, 122, COLORS.cream, studio.accent);
    fittedText("Your signal needs somewhere to go.", {
      x: 76,
      y: 340,
      maxWidth: 900,
      maxLines: 3,
      startSize: 84,
      minSize: 58,
      lineHeight: 0.98,
      weight: 700,
      family: FONT_READING,
      color: COLORS.cream
    });
    drawSingleLine(message.toUpperCase(), {
      x: 80,
      y: 650,
      maxWidth: 850,
      startSize: 30,
      minSize: 20,
      weight: 700,
      family: FONT_INTERFACE,
      color: studio.accent
    });
  }

  function vibeCodeCopy() {
    const destination = normalizeDestination(fieldValue("vibeCodeDestination"));
    return {
      destination,
      destinationLabel: destinationLabel(destination),
      title: fieldValue("vibeCodeTitle", "A good thing is hiding here."),
      prompt: fieldValue("vibeCodePrompt", "Scan to follow the signal")
    };
  }

  async function render() {
    const request = ++studio.renderRequest;
    let copy;
    try {
      copy = vibeCodeCopy();
    } catch (error) {
      if (request !== studio.renderRequest) return false;
      studio.currentDestination = "";
      drawInvalidState(error.message);
      setStatus(error.message, true);
      return false;
    }

    if (!window.QRCode?.toCanvas) {
      drawInvalidState("The QR encoder could not load.");
      setStatus("The QR encoder could not load. Refresh and try again.", true);
      return false;
    }

    try {
      await window.QRCode.toCanvas(qrCanvas, copy.destination, {
        errorCorrectionLevel: "H",
        margin: 4,
        width: 600,
        color: {
          dark: COLORS.charcoalDeep,
          light: COLORS.cream
        }
      });
    } catch {
      if (request !== studio.renderRequest) return false;
      drawInvalidState("That destination could not become a code.");
      setStatus("That destination could not become a Vibe Code.", true);
      return false;
    }

    if (request !== studio.renderRequest) return false;
    studio.currentDestination = copy.destination;
    if (studio.layout === "portal") drawPortalLayout(copy, qrCanvas);
    else drawSignalLayout(copy, qrCanvas);
    setStatus(`Signal ready for ${copy.destinationLabel}.`);
    return true;
  }

  function scheduleRender() {
    window.clearTimeout(studio.renderTimer);
    studio.renderTimer = window.setTimeout(render, 120);
  }

  function updateControlState() {
    view.querySelectorAll("[data-vibe-code-layout]").forEach((button) => {
      const active = button.dataset.vibeCodeLayout === studio.layout;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    view.querySelectorAll("[data-vibe-code-accent]").forEach((button) => {
      const active = button.dataset.vibeCodeAccent === studio.accent;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function reset() {
    form.reset();
    studio.layout = DEFAULTS.layout;
    studio.accent = DEFAULTS.accent;
    updateControlState();
    render();
  }

  async function copyDestination() {
    let destination;
    try {
      destination = normalizeDestination(destinationInput?.value);
    } catch (error) {
      setStatus(error.message, true);
      destinationInput?.focus();
      return;
    }

    try {
      await navigator.clipboard.writeText(destination);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = destination;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    setStatus("Destination copied. Send the signal.");
  }

  async function download() {
    const ready = await render();
    if (!ready) {
      destinationInput?.focus();
      return;
    }
    setStatus("Preparing your 1080 x 1080 Vibe Code...");
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("This browser could not download the Vibe Code.", true);
        return;
      }
      const title = fieldValue("vibeCodeTitle", "vibe-code")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "vibe-code";
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${title}-vibe-code.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus("Vibe Code downloaded. Your signal is ready.");
    }, "image/png");
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", scheduleRender);
  view.addEventListener("click", (event) => {
    const target = event.target.closest("[data-vibe-code-layout], [data-vibe-code-accent], [data-vibe-code-action]");
    if (!target) return;
    if (target.dataset.vibeCodeLayout) studio.layout = target.dataset.vibeCodeLayout;
    if (target.dataset.vibeCodeAccent) studio.accent = target.dataset.vibeCodeAccent;
    if (target.dataset.vibeCodeAction === "reset") {
      reset();
      return;
    }
    if (target.dataset.vibeCodeAction === "copy") {
      copyDestination();
      return;
    }
    if (target.dataset.vibeCodeAction === "download") {
      download();
      return;
    }
    updateControlState();
    render();
  });

  window.vvVibeCodeStudio = { render };
  brandMark.addEventListener("load", render);
  brandMark.src = BRAND_MARK_URL;
  updateControlState();
  render();
  document.fonts?.ready.then(render).catch(() => {});
})();
