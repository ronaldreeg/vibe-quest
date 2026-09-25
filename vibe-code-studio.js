(() => {
  "use strict";

  const SIZE = 1080;
  const FONT_READING = '"Faculty Glyphic", Georgia, serif';
  const FONT_INTERFACE = '"VT323", monospace';
  const BRAND_MARK_URL = "./assets/brand/VQ-logo-flyer.svg?v=20260925-v1";
  const ICON_LIBRARY_URL = "./assets/brand/master-icon-library.svg?v=20260921-balanced-icons-v1";
  const ICON_PATTERN_URL = "./assets/brand/icon-pattern.png?v=20260913-v2";
  const GEM_MARK_URL = "./assets/brand/inventory.svg?v=20260912-v1";
  const ICON_LIBRARY_SIZE = { width: 3144.72, height: 115.56 };
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
    wand: { x: 2592.7, y: 45.5, width: 35.1, height: 35.1 },
    camera: { x: 3021.4, y: 43, width: 42.7, height: 42.4 },
    unicorn: { x: 2896.1, y: 44.7, width: 40.6, height: 39.5 },
    cowboyHat: { x: 196.4, y: 39.9, width: 55.5, height: 44.9 },
    bike: { x: 615.4, y: 42.8, width: 62.2, height: 44.3 }
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
    teal: "#174f63",
    wine: "#642f45",
    indigo: "#343b5e",
    olive: "#4d5231"
  };
  const RETRO_ACCENT_COLORS = ["#fa622e", "#fc8a43", "#f6a938", "#f8d23d"];
  const DEFAULTS = {
    destinationType: "link",
    layout: "signal",
    accent: COLORS.teal,
    mark: "key"
  };
  const DESTINATION_TYPES = {
    link: {
      label: "Web link",
      fieldLabel: "Destination link",
      placeholder: "Website, sign-up page, map...",
      help: "Paste the page people should reach after scanning.",
      defaultDestination: "https://www.vibe-quest.net/",
      defaultTitle: "A good thing is hiding here.",
      defaultPrompt: "Scan to follow the signal"
    },
    venmo: {
      label: "Venmo",
      fieldLabel: "Venmo payment link",
      placeholder: "Paste a link copied from Venmo...",
      help: "In Venmo, share your profile or payment request and paste that link here.",
      allowedHosts: ["venmo.com", "venmo.me"],
      defaultDestination: "",
      defaultTitle: "Support this good thing.",
      defaultPrompt: "Scan to pay with Venmo"
    },
    cashapp: {
      label: "Cash App",
      fieldLabel: "Cash App payment link",
      placeholder: "Paste a payment link copied from Cash App...",
      help: "In Cash App, create or share a payment link and paste it here.",
      allowedHosts: ["cash.app"],
      defaultDestination: "",
      defaultTitle: "Support this good thing.",
      defaultPrompt: "Scan to pay with Cash App"
    }
  };

  const view = document.querySelector("#shareView");
  const form = document.querySelector("#vibeCodeForm");
  const canvas = document.querySelector("#vibeCodeCanvas");
  const destinationInput = document.querySelector("#vibeCodeDestination");
  const destinationLabelElement = document.querySelector("#vibeCodeDestinationLabel");
  const destinationHelp = document.querySelector("#vibeCodeDestinationHelp");
  const paymentNote = document.querySelector("#vibeCodePaymentNote");
  const titleInput = form?.elements.namedItem("vibeCodeTitle");
  const promptInput = form?.elements.namedItem("vibeCodePrompt");
  const copyButton = view?.querySelector('[data-vibe-code-action="copy"]');
  const status = document.querySelector("#vibeCodeStatus");
  if (!view || !form || !(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;

  const qrCanvas = document.createElement("canvas");
  const brandMark = new Image();
  brandMark.decoding = "async";
  const iconLibrary = new Image();
  iconLibrary.decoding = "async";
  const iconPattern = new Image();
  iconPattern.decoding = "async";
  const gemMark = new Image();
  gemMark.decoding = "async";
  const studio = {
    destinationType: DEFAULTS.destinationType,
    destinationValues: {
      link: destinationInput?.value || DESTINATION_TYPES.link.defaultDestination,
      venmo: "",
      cashapp: ""
    },
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

  function destinationConfig(type = studio.destinationType) {
    return DESTINATION_TYPES[type] || DESTINATION_TYPES.link;
  }

  function normalizeDestination(value, type = studio.destinationType) {
    const trimmed = String(value || "").trim();
    const config = destinationConfig(type);
    if (!trimmed) {
      throw new Error(type === "link"
        ? "Add a destination to generate your Vibe Code."
        : `Paste a ${config.label} payment link to generate your Vibe Code.`);
    }
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
    if (config.allowedHosts) {
      const host = parsed.hostname.toLowerCase();
      const matchesProvider = config.allowedHosts.some((allowedHost) => (
        host === allowedHost || host.endsWith(`.${allowedHost}`)
      ));
      if (!matchesProvider) throw new Error(`Paste a ${config.label} link copied from the app.`);
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

  function drawIconPatternRegion(x, y, width, height, offsetX = 0, offsetY = -6, background = studio.accent) {
    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    context.fillStyle = background;
    context.fillRect(x, y, width, height);

    if (!iconPattern.complete || iconPattern.naturalWidth <= 0) {
      context.restore();
      drawIconField(x, y, width, height);
      return;
    }

    const sourceY = 43;
    const sourceHeight = 1009;
    const scale = (SIZE / iconPattern.naturalWidth) * 1.22;
    const tileWidth = iconPattern.naturalWidth * scale;
    const tileHeight = sourceHeight * scale;
    const startX = x + offsetX;
    const startY = y + offsetY;
    context.imageSmoothingEnabled = false;

    for (let tileY = startY; tileY < y + height; tileY += tileHeight) {
      for (let tileX = startX; tileX < x + width; tileX += tileWidth) {
        context.drawImage(
          iconPattern,
          0,
          sourceY,
          iconPattern.naturalWidth,
          sourceHeight,
          tileX,
          tileY,
          tileWidth,
          tileHeight
        );
      }
    }
    context.restore();
  }

  function drawCodeMark(centerX, centerY, qrSize, style = "framed") {
    const badgeSize = Math.round(qrSize * 0.14);
    const inset = Math.max(8, Math.round(badgeSize * 0.09));
    const x = Math.round(centerX - badgeSize / 2);
    const y = Math.round(centerY - badgeSize / 2);

    if (style === "dark") {
      context.fillStyle = COLORS.charcoalDeep;
      context.fillRect(x, y, badgeSize, badgeSize);
      drawLibraryIcon(
        studio.mark,
        x + inset * 1.35,
        y + inset * 1.35,
        badgeSize - inset * 2.7,
        badgeSize - inset * 2.7
      );
      return;
    }

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

  function drawQrFrame(x, y, size, qr) {
    const stripeWidth = 7;
    const frameWidth = stripeWidth * RETRO_ACCENT_COLORS.length;

    context.fillStyle = rgba(COLORS.charcoalDeep, 0.42);
    context.fillRect(
      x - frameWidth + 18,
      y - frameWidth + 18,
      size + frameWidth * 2,
      size + frameWidth * 2
    );

    RETRO_ACCENT_COLORS.forEach((color, index) => {
      const inset = index * stripeWidth;
      const offset = frameWidth - inset;
      context.fillStyle = color;
      context.fillRect(x - offset, y - offset, size + offset * 2, size + offset * 2);
    });

    context.drawImage(qr, x, y, size, size);
    drawCodeMark(x + size / 2, y + size / 2, size);
  }

  function drawBareQr(x, y, size, qr, markStyle = "framed") {
    context.drawImage(qr, x, y, size, size);
    drawCodeMark(x + size / 2, y + size / 2, size, markStyle);
  }

  function drawDestinationTag(copy, options) {
    if (copy.destinationType === "link") return;
    drawSingleLine(`${copy.destinationTypeLabel.toUpperCase()} PAYMENT`, {
      x: options.x,
      y: options.y,
      maxWidth: options.maxWidth,
      startSize: options.startSize || 22,
      minSize: options.minSize || 17,
      weight: 700,
      family: FONT_INTERFACE,
      color: options.color,
      align: options.align || "left"
    });
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

    drawIconPatternRegion(0, 0, 32, 900);
    drawBrand(46, 24, 160, accent);
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
      color: COLORS.cream
    });
    drawDestinationTag(copy, {
      x: 70,
      y: 586,
      maxWidth: 320,
      color: COLORS.qrOrange
    });
    drawQrFrame(460, 230, 556, qr);
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

    drawIconPatternRegion(0, 900, SIZE, 180, -18);
  }

  function drawPortalLayout(copy, qr) {
    const accent = studio.accent;
    context.fillStyle = COLORS.cream;
    context.fillRect(0, 0, SIZE, SIZE);
    context.fillStyle = accent;
    context.fillRect(0, 0, SIZE, 24);

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

    drawDestinationTag(copy, {
      x: SIZE / 2,
      y: 238,
      maxWidth: 860,
      color: accent,
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
    drawIconPatternRegion(0, 900, SIZE, 180, -18);
  }

  function drawIconFieldLayout(copy, qr) {
    context.fillStyle = COLORS.charcoalDeep;
    context.fillRect(0, 0, SIZE, SIZE);
    drawIconPatternRegion(0, 0, SIZE, SIZE, -20, -14, COLORS.charcoalDeep);

    const panel = { x: 170, y: 145, width: 740, height: 760 };
    context.fillStyle = COLORS.charcoalDeep;
    context.fillRect(panel.x, panel.y, panel.width, panel.height);

    fittedText(copy.title, {
      x: SIZE / 2,
      y: 190,
      maxWidth: 660,
      maxLines: 2,
      startSize: 62,
      minSize: 40,
      lineHeight: 0.96,
      blockHeight: 112,
      weight: 700,
      family: FONT_READING,
      color: COLORS.cream,
      align: "center"
    });

    drawDestinationTag(copy, {
      x: SIZE / 2,
      y: 295,
      maxWidth: 650,
      color: COLORS.qrOrange,
      align: "center"
    });

    drawBareQr(310, 320, 460, qr, "dark");
    drawSingleLine(copy.prompt.toUpperCase(), {
      x: SIZE / 2,
      y: 812,
      maxWidth: 650,
      startSize: 29,
      minSize: 20,
      weight: 700,
      family: FONT_INTERFACE,
      color: COLORS.cream,
      align: "center"
    });
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
    const config = destinationConfig();
    const destination = normalizeDestination(fieldValue("vibeCodeDestination"), studio.destinationType);
    return {
      destination,
      destinationLabel: destinationLabel(destination),
      destinationType: studio.destinationType,
      destinationTypeLabel: config.label,
      title: fieldValue("vibeCodeTitle", config.defaultTitle),
      prompt: fieldValue("vibeCodePrompt", config.defaultPrompt)
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
          dark: studio.layout === "signal" ? COLORS.charcoalDeep : COLORS.qrOrange,
          light: studio.layout === "icon-field" ? "#00000000" : COLORS.cream
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
    else if (studio.layout === "icon-field") drawIconFieldLayout(copy, qrCanvas);
    else drawSignalLayout(copy, qrCanvas);
    setStatus(`${copy.destinationTypeLabel} signal ready for ${copy.destinationLabel}.`);
    return true;
  }

  function scheduleRender() {
    window.clearTimeout(studio.renderTimer);
    studio.renderTimer = window.setTimeout(render, 120);
  }

  function fieldUsesDefaultCopy(field, key) {
    const value = String(field?.value || "").trim();
    return !value || Object.values(DESTINATION_TYPES).some((config) => config[key] === value);
  }

  function updateDestinationUi() {
    const config = destinationConfig();
    if (destinationLabelElement) destinationLabelElement.textContent = config.fieldLabel;
    if (destinationHelp) destinationHelp.textContent = config.help;
    if (paymentNote) paymentNote.hidden = studio.destinationType === "link";
    if (copyButton) copyButton.textContent = studio.destinationType === "link" ? "Copy URL" : "Copy payment link";
    if (destinationInput) {
      destinationInput.placeholder = config.placeholder;
      destinationInput.inputMode = "url";
      destinationInput.autocomplete = studio.destinationType === "link" ? "url" : "off";
    }
    canvas.setAttribute(
      "aria-label",
      studio.destinationType === "link"
        ? "Preview of your branded Vibe Quest QR code"
        : `Preview of your branded Vibe Quest ${config.label} payment QR code`
    );
  }

  function setDestinationType(nextType) {
    if (!DESTINATION_TYPES[nextType] || nextType === studio.destinationType) return;
    const updateTitle = fieldUsesDefaultCopy(titleInput, "defaultTitle");
    const updatePrompt = fieldUsesDefaultCopy(promptInput, "defaultPrompt");
    if (destinationInput) studio.destinationValues[studio.destinationType] = destinationInput.value;

    studio.destinationType = nextType;
    const config = destinationConfig();
    if (destinationInput) destinationInput.value = studio.destinationValues[nextType] || config.defaultDestination;
    if (updateTitle && titleInput) titleInput.value = config.defaultTitle;
    if (updatePrompt && promptInput) promptInput.value = config.defaultPrompt;
    updateControlState();
    render();
  }

  function updateControlState() {
    view.querySelectorAll("[data-vibe-code-destination-type]").forEach((button) => {
      const active = button.dataset.vibeCodeDestinationType === studio.destinationType;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
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
    updateDestinationUi();
  }

  function reset() {
    form.reset();
    studio.destinationType = DEFAULTS.destinationType;
    studio.destinationValues = {
      link: DESTINATION_TYPES.link.defaultDestination,
      venmo: "",
      cashapp: ""
    };
    studio.layout = DEFAULTS.layout;
    studio.accent = DEFAULTS.accent;
    studio.mark = DEFAULTS.mark;
    updateControlState();
    render();
  }

  async function copyDestination() {
    let destination;
    try {
      destination = normalizeDestination(destinationInput?.value, studio.destinationType);
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
    setStatus(`${destinationConfig().label} link copied. Send the signal.`);
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
      const destinationSuffix = studio.destinationType === "link" ? "" : `-${studio.destinationType}`;
      link.download = `${title}${destinationSuffix}-vibe-code.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus("Vibe Code downloaded. Your signal is ready.");
    }, "image/png");
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", (event) => {
    if (event.target === destinationInput) studio.destinationValues[studio.destinationType] = destinationInput.value;
    scheduleRender();
  });
  view.addEventListener("click", (event) => {
    const target = event.target.closest("[data-vibe-code-destination-type], [data-vibe-code-layout], [data-vibe-code-accent], [data-vibe-code-mark], [data-vibe-code-action]");
    if (!target) return;
    if (target.dataset.vibeCodeDestinationType) {
      setDestinationType(target.dataset.vibeCodeDestinationType);
      return;
    }
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
  iconPattern.addEventListener("load", render);
  iconPattern.src = ICON_PATTERN_URL;
  gemMark.addEventListener("load", render);
  gemMark.src = GEM_MARK_URL;
  updateControlState();
  render();
  document.fonts?.ready.then(render).catch(() => {});
})();
