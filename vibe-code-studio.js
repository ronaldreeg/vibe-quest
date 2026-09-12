(() => {
  "use strict";

  const SIZE = 1080;
  const FONT_READING = '"Faculty Glyphic", Georgia, serif';
  const FONT_INTERFACE = '"VT323", monospace';
  const BRAND_MARK_URL = "./assets/brand/logo-mark-signal.svg?v=20260911-flyer-v2";
  const ICON_LIBRARY_URL = "./assets/brand/master-icon-library.svg?v=20260912-v2";
  const GEM_MARK_URL = "./assets/brand/inventory.svg?v=20260912-v1";
  const ICON_LIBRARY_SIZE = { width: 2718.39, height: 115.56 };
  const CODE_MARKS = {
    tent: { x: 6, y: 36.8, width: 48, height: 50.8 },
    racketBall: { x: 65.2, y: 38, width: 49.6, height: 49.6 },
    confetti: { x: 132, y: 40.4, width: 44.8, height: 44.8 },
    bowl: { x: 196, y: 39.6, width: 56, height: 45.6 },
    beer: { x: 273.2, y: 36.8, width: 43.2, height: 47.6 },
    sparkles: { x: 327.6, y: 41.2, width: 40.4, height: 40.4 },
    gift: { x: 381.2, y: 41.2, width: 43.2, height: 43.2 },
    key: { x: 440.4, y: 40, width: 41.2, height: 46.4 },
    gem: { asset: "gem" },
    flag: { x: 499.6, y: 40, width: 40.8, height: 46.8 },
    skull: { x: 559.6, y: 39.6, width: 42.8, height: 44.4 },
    scooter: { x: 615.2, y: 42.8, width: 62.4, height: 44.4 },
    lounge: { x: 695.6, y: 34.8, width: 50.4, height: 50.4 },
    mask: { x: 763.6, y: 41.6, width: 41.2, height: 44.4 },
    dice: { x: 824.8, y: 39.2, width: 47.6, height: 48 },
    music: { x: 890, y: 40, width: 46.4, height: 46.8 },
    bandage: { x: 955.6, y: 44, width: 51.2, height: 44.4 },
    fruit: { x: 1020.8, y: 34.4, width: 44.4, height: 50.8 },
    palette: { x: 1078.8, y: 42, width: 43.2, height: 40.4 },
    burger: { x: 1136.8, y: 40.4, width: 43.6, height: 43.6 },
    baseball: { x: 1196.8, y: 42.4, width: 43.6, height: 43.6 },
    sword: { x: 1253.6, y: 42, width: 34.8, height: 44 },
    mushroom: { x: 1302, y: 44.4, width: 45.2, height: 42.4 },
    dumbbell: { x: 1359.2, y: 47.2, width: 50, height: 34.4 },
    cup: { x: 1421.2, y: 46.8, width: 34.4, height: 36.8 },
    utensils: { x: 1468.8, y: 40.4, width: 27.6, height: 45.6 },
    orb: { x: 1509.2, y: 40.4, width: 46, height: 46.4 },
    pill: { x: 1572, y: 42, width: 41.2, height: 41.2 },
    hotdog: { x: 1625.2, y: 42.8, width: 43.6, height: 52.4 },
    basketball: { x: 1679.2, y: 42.4, width: 45.6, height: 40 },
    bird: { x: 1739.6, y: 44.8, width: 43.2, height: 40.4 },
    cauldron: { x: 1798.8, y: 44.8, width: 38.8, height: 41.2 },
    parcels: { x: 1858.4, y: 47.6, width: 39.6, height: 37.2 },
    cart: { x: 1918.8, y: 41.2, width: 52.4, height: 42.4 },
    lightning: { x: 1989.2, y: 43.2, width: 35.6, height: 40.4 },
    cassette: { x: 2046, y: 48.4, width: 44.4, height: 33.2 },
    ski: { x: 2114.4, y: 40.8, width: 43.2, height: 46 },
    invader: { x: 2178.4, y: 42, width: 45.6, height: 40 },
    puzzle: { x: 2244, y: 38.4, width: 42.4, height: 42.4 },
    horse: { x: 2305.6, y: 39.2, width: 42.8, height: 42.8 },
    trophy: { x: 2366.4, y: 43.2, width: 37.6, height: 37.6 },
    racket: { x: 2427.2, y: 41.6, width: 42, height: 39.6 },
    swim: { x: 2486.8, y: 38, width: 38, height: 43.6 },
    building: { x: 2544, y: 40.4, width: 40.8, height: 40.8 },
    wand: { x: 2602.8, y: 42, width: 38.8, height: 38.8 }
  };
  const ICON_RIBBON = [
    "tent", "racketBall", "confetti", "bowl", "beer", "sparkles", "gift", "key", "flag", "skull",
    "scooter", "lounge", "mask", "dice", "music", "bandage", "fruit", "palette", "burger", "baseball",
    "sword", "mushroom", "dumbbell", "cup", "utensils", "orb", "pill", "hotdog", "basketball", "bird",
    "cauldron", "parcels", "cart", "lightning", "cassette", "ski", "invader", "puzzle", "horse", "trophy"
  ];
  const COLORS = {
    charcoal: "#2f3035",
    charcoalDeep: "#22242a",
    cream: "#f3e9c4",
    qrOrange: "#fa622e",
    pink: "#f45077",
    teal: "#0f8fb1",
    yellow: "#f8d23d"
  };
  const DEFAULTS = {
    layout: "signal",
    accent: COLORS.teal,
    mark: "key"
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
  const brandCanvas = document.createElement("canvas");
  brandCanvas.width = 500;
  brandCanvas.height = 500;
  const brandContext = brandCanvas.getContext("2d");
  const brandMark = new Image();
  brandMark.decoding = "async";
  const iconLibrary = new Image();
  iconLibrary.decoding = "async";
  const gemMark = new Image();
  gemMark.decoding = "async";
  const studio = {
    layout: DEFAULTS.layout,
    accent: DEFAULTS.accent,
    mark: DEFAULTS.mark,
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
    const textHeight = lines.length * lineHeight;
    const startY = options.blockHeight
      ? options.y + Math.max(0, (options.blockHeight - textHeight) / 2)
      : options.y;
    lines.forEach((line, index) => context.fillText(line, options.x, startY + index * lineHeight));
    return startY + textHeight;
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

  function drawBrand(x, y, size, accent) {
    if (brandMark.complete && brandMark.naturalWidth > 0 && brandContext) {
      brandContext.clearRect(0, 0, brandCanvas.width, brandCanvas.height);
      brandContext.drawImage(brandMark, 0, 0, brandCanvas.width, brandCanvas.height);
      const cropX = brandCanvas.width * 0.18;
      const cropY = brandCanvas.height * 0.09;
      const cropWidth = brandCanvas.width * 0.67;
      const cropHeight = brandCanvas.height * 0.71;
      const width = size * (cropWidth / cropHeight);
      context.drawImage(
        brandCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        x + (size - width) / 2,
        y,
        width,
        size
      );
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
  }

  function drawPixelSpark(x, y, size, color) {
    const unit = Math.max(4, Math.round(size / 5));
    context.fillStyle = color;
    context.fillRect(x - unit / 2, y - size / 2, unit, size);
    context.fillRect(x - size / 2, y - unit / 2, size, unit);
    context.fillRect(x - unit * 1.5, y - unit * 1.5, unit, unit);
    context.fillRect(x + unit * 0.5, y + unit * 0.5, unit, unit);
  }

  function drawLibraryIcon(markName, x, y, maxWidth, maxHeight, alpha = 1) {
    const mark = CODE_MARKS[markName] || CODE_MARKS[DEFAULTS.mark];
    if (mark.asset === "gem") {
      if (!gemMark.complete || gemMark.naturalWidth <= 0) {
        drawPixelSpark(x + maxWidth / 2, y + maxHeight / 2, Math.min(maxWidth, maxHeight) * 0.56, studio.accent);
        return;
      }
      context.save();
      context.globalAlpha = alpha;
      context.imageSmoothingEnabled = false;
      context.drawImage(gemMark, x, y, maxWidth, maxHeight);
      context.restore();
      return;
    }

    if (!iconLibrary.complete || iconLibrary.naturalWidth <= 0) {
      drawPixelSpark(x + maxWidth / 2, y + maxHeight / 2, Math.min(maxWidth, maxHeight) * 0.56, studio.accent);
      return;
    }

    const ratio = mark.width / mark.height;
    let width = maxWidth;
    let height = width / ratio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }

    const scaleX = iconLibrary.naturalWidth / ICON_LIBRARY_SIZE.width;
    const scaleY = iconLibrary.naturalHeight / ICON_LIBRARY_SIZE.height;
    context.save();
    context.globalAlpha = alpha;
    context.imageSmoothingEnabled = false;
    context.drawImage(
      iconLibrary,
      mark.x * scaleX,
      mark.y * scaleY,
      mark.width * scaleX,
      mark.height * scaleY,
      x + (maxWidth - width) / 2,
      y + (maxHeight - height) / 2,
      width,
      height
    );
    context.restore();
  }

  function drawIconField(x, y, width, height) {
    const rows = 3;
    const rowHeight = height / rows;
    const offsets = [-28, 5, -46];
    const yOffsets = [-7, 2, 5];
    const sizes = [54, 45, 60, 49, 57, 47, 62, 51];
    let iconIndex = 0;

    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();

    for (let row = 0; row < rows; row += 1) {
      let iconX = x + offsets[row];
      while (iconX < x + width + 40) {
        const size = sizes[(iconIndex + row * 3) % sizes.length];
        const iconY = y + row * rowHeight + (rowHeight - size) / 2 + yOffsets[row];
        drawLibraryIcon(ICON_RIBBON[iconIndex % ICON_RIBBON.length], iconX, iconY, size, size);
        iconX += size + 3 + ((iconIndex + row) % 3) * 2;
        iconIndex += 1;
      }
    }

    context.restore();
  }

  function drawCodeMark(centerX, centerY, qrSize) {
    const badgeSize = Math.round(qrSize * 0.14);
    const inset = Math.max(8, Math.round(badgeSize * 0.09));
    const x = Math.round(centerX - badgeSize / 2);
    const y = Math.round(centerY - badgeSize / 2);

    context.fillStyle = COLORS.cream;
    context.fillRect(x, y, badgeSize, badgeSize);
    context.fillStyle = COLORS.charcoalDeep;
    context.fillRect(x + inset, y + inset, badgeSize - inset * 2, badgeSize - inset * 2);
    drawLibraryIcon(
      studio.mark,
      x + inset * 1.7,
      y + inset * 1.7,
      badgeSize - inset * 3.4,
      badgeSize - inset * 3.4
    );
  }

  function drawQrFrame(x, y, size, qr, accent) {
    context.fillStyle = rgba(COLORS.charcoalDeep, 0.42);
    context.fillRect(x + 18, y + 18, size, size);
    context.fillStyle = accent;
    context.fillRect(x - 12, y - 12, size + 24, size + 24);
    context.drawImage(qr, x, y, size, size);
    drawCodeMark(x + size / 2, y + size / 2, size);

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

  function drawBareQr(x, y, size, qr) {
    context.drawImage(qr, x, y, size, size);
    drawCodeMark(x + size / 2, y + size / 2, size);
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

    drawBrand(38, 24, 160, accent);
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
    context.fillRect(0, 918, SIZE, 162);
    drawIconField(0, 918, SIZE, 162);
  }

  function drawPortalLayout(copy, qr) {
    const accent = studio.accent;
    context.fillStyle = COLORS.cream;
    context.fillRect(0, 0, SIZE, SIZE);
    context.fillStyle = accent;
    context.fillRect(0, 0, SIZE, 24);
    context.fillRect(0, 918, SIZE, 162);

    fittedText(copy.title, {
      x: SIZE / 2,
      y: 82,
      maxWidth: 900,
      maxLines: 2,
      startSize: 72,
      minSize: 46,
      lineHeight: 0.98,
      blockHeight: 142,
      weight: 700,
      family: FONT_READING,
      color: COLORS.charcoalDeep,
      align: "center"
    });

    drawBareQr(265, 270, 550, qr);
    drawSingleLine(copy.prompt.toUpperCase(), {
      x: SIZE / 2,
      y: 846,
      maxWidth: 860,
      startSize: 29,
      minSize: 20,
      weight: 700,
      family: FONT_INTERFACE,
      color: accent,
      align: "center"
    });
    drawIconField(0, 918, SIZE, 162);
  }

  function drawInvalidState(message) {
    context.fillStyle = COLORS.charcoal;
    context.fillRect(0, 0, SIZE, SIZE);
    context.fillStyle = studio.accent;
    context.fillRect(0, 0, 24, SIZE);
    drawBrand(38, 24, 160, studio.accent);
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
          dark: studio.layout === "portal" ? COLORS.qrOrange : COLORS.charcoalDeep,
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
    view.querySelectorAll("[data-vibe-code-mark]").forEach((button) => {
      const active = button.dataset.vibeCodeMark === studio.mark;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function reset() {
    form.reset();
    studio.layout = DEFAULTS.layout;
    studio.accent = DEFAULTS.accent;
    studio.mark = DEFAULTS.mark;
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
    const target = event.target.closest("[data-vibe-code-layout], [data-vibe-code-accent], [data-vibe-code-mark], [data-vibe-code-action]");
    if (!target) return;
    if (target.dataset.vibeCodeLayout) studio.layout = target.dataset.vibeCodeLayout;
    if (target.dataset.vibeCodeAccent) studio.accent = target.dataset.vibeCodeAccent;
    if (target.dataset.vibeCodeMark) studio.mark = target.dataset.vibeCodeMark;
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
  iconLibrary.addEventListener("load", render);
  iconLibrary.src = ICON_LIBRARY_URL;
  gemMark.addEventListener("load", render);
  gemMark.src = GEM_MARK_URL;
  updateControlState();
  render();
  document.fonts?.ready.then(render).catch(() => {});
})();
