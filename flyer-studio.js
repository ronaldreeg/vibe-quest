(() => {
  "use strict";

  const WIDTH = 1080;
  const HEIGHT = 1350;
  const FONT_READING = '"Faculty Glyphic", Georgia, serif';
  const FONT_INTERFACE = '"VT323", monospace';
  const BRAND_MARK_URL = "./assets/brand/logo-mark-signal.svg?v=20260911-flyer-v1";
  const DEFAULTS = {
    layout: "full",
    accent: "#f8d23d",
    symbol: "spark"
  };

  const view = document.querySelector("#shareView");
  const form = document.querySelector("#flyerForm");
  const canvas = document.querySelector("#flyerCanvas");
  const photoInput = document.querySelector("#flyerPhotoInput");
  const noteInput = document.querySelector("#flyerNote");
  const noteCountOutput = document.querySelector("#flyerNoteCount");
  const subheaderSizeInput = document.querySelector("#flyerSubheaderSize");
  const subheaderSizeOutput = document.querySelector("#flyerSubheaderSizeValue");
  const status = document.querySelector("#flyerStatus");
  const dropZone = document.querySelector(".flyer-canvas-shell");
  if (!view || !form || !(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    if (status) {
      status.textContent = "This browser could not open the flyer canvas.";
      status.classList.add("is-error");
    }
    return;
  }

  const brandMark = new Image();
  brandMark.decoding = "async";

  const studio = {
    layout: DEFAULTS.layout,
    accent: DEFAULTS.accent,
    symbol: DEFAULTS.symbol,
    photo: null,
    photoUrl: "",
    photoRequest: 0
  };

  function fieldValue(name, fallback = "") {
    const field = form.elements.namedItem(name);
    return String(field?.value || fallback).trim();
  }

  function flyerCopy() {
    const requestedScale = Number(subheaderSizeInput?.value || 100) / 100;
    return {
      title: fieldValue("flyerTitle", "Untitled Quest"),
      kicker: fieldValue("flyerKicker", "A Vibe Quest"),
      details: fieldValue("flyerDetails", "Somewhere worth going"),
      note: fieldValue("flyerNote", "Show up curious."),
      subheaderScale: Number.isFinite(requestedScale)
        ? Math.min(1.8, Math.max(0.8, requestedScale))
        : 1
    };
  }

  function scaledSubheaderSize(size, copy) {
    return Math.round(size * copy.subheaderScale);
  }

  function updateSubheaderSizeOutput() {
    if (!subheaderSizeOutput) return;
    subheaderSizeOutput.value = `${Math.round(Number(subheaderSizeInput?.value || 100))}%`;
  }

  function updateNoteCount() {
    if (!noteCountOutput) return;
    const max = Number(noteInput?.maxLength) > 0 ? Number(noteInput.maxLength) : 150;
    const used = String(noteInput?.value || "").length;
    noteCountOutput.value = `${used} / ${max}`;
  }

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function rgba(hex, alpha) {
    const value = String(hex).replace("#", "");
    const normalized = value.length === 3
      ? value.split("").map((part) => part + part).join("")
      : value.padEnd(6, "0").slice(0, 6);
    const number = Number.parseInt(normalized, 16);
    return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
  }

  function contrastColor(hex) {
    const value = String(hex).replace("#", "").padEnd(6, "0").slice(0, 6);
    const number = Number.parseInt(value, 16);
    const red = (number >> 16) & 255;
    const green = (number >> 8) & 255;
    const blue = number & 255;
    return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? "#2f3035" : "#f3e9c4";
  }

  function setFont(size, weight = 800, family = FONT_READING) {
    context.font = `${weight} ${size}px ${family}`;
  }

  function splitLongWord(word, maxWidth) {
    const chunks = [];
    let chunk = "";
    [...word].forEach((character) => {
      const candidate = chunk + character;
      if (chunk && context.measureText(candidate).width > maxWidth) {
        chunks.push(chunk);
        chunk = character;
      } else {
        chunk = candidate;
      }
    });
    if (chunk) chunks.push(chunk);
    return chunks;
  }

  function wrapLines(text, maxWidth) {
    const sourceWords = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    const words = sourceWords.flatMap((word) => context.measureText(word).width > maxWidth
      ? splitLongWord(word, maxWidth)
      : [word]);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function fittedLines(text, maxWidth, maxLines, startSize, minSize, weight = 800, family = FONT_READING, maxHeight = Infinity, lineHeight = 1) {
    let size = startSize;
    let lines = [];
    while (size >= minSize) {
      setFont(size, weight, family);
      lines = wrapLines(text, maxWidth);
      if (lines.length <= maxLines && lines.length * size * lineHeight <= maxHeight) return { lines, size };
      size -= 2;
    }
    setFont(minSize, weight, family);
    const availableLines = Math.max(1, Math.min(maxLines, Math.floor(maxHeight / (minSize * lineHeight))));
    const wrappedLines = wrapLines(text, maxWidth);
    lines = wrappedLines.slice(0, availableLines);
    if (wrappedLines.length > availableLines) {
      let finalLine = lines[availableLines - 1];
      while (finalLine && context.measureText(`${finalLine}...`).width > maxWidth) {
        finalLine = finalLine.slice(0, -1).trim();
      }
      lines[availableLines - 1] = `${finalLine}...`;
    }
    return { lines, size: minSize };
  }

  function drawLines(lines, x, y, lineHeight, color, align = "left") {
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = "top";
    lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
    return y + lines.length * lineHeight;
  }

  function drawFittedText(text, options) {
    const result = fittedLines(
      text,
      options.maxWidth,
      options.maxLines,
      options.startSize,
      options.minSize,
      options.weight || 800,
      options.family || FONT_READING,
      options.maxHeight ?? Infinity,
      options.lineHeight || 1
    );
    setFont(result.size, options.weight || 800, options.family || FONT_READING);
    const lineHeight = result.size * (options.lineHeight || 1);
    return drawLines(result.lines, options.x, options.y, lineHeight, options.color, options.align);
  }

  function drawSingleLine(text, options) {
    let size = options.startSize;
    const value = String(text || "");
    while (size > options.minSize) {
      setFont(size, options.weight || 800, options.family || FONT_INTERFACE);
      if (context.measureText(value).width <= options.maxWidth) break;
      size -= 1;
    }
    setFont(size, options.weight || 800, options.family || FONT_INTERFACE);
    context.fillStyle = options.color;
    context.textAlign = options.align || "left";
    context.textBaseline = options.baseline || "middle";
    context.fillText(value, options.x, options.y, options.maxWidth);
  }

  function drawMedia(x, y, width, height, accent) {
    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();

    if (studio.photo) {
      const sourceWidth = studio.photo.naturalWidth || studio.photo.width;
      const sourceHeight = studio.photo.naturalHeight || studio.photo.height;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;
      context.drawImage(
        studio.photo,
        x + (width - drawWidth) / 2,
        y + (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
    } else {
      context.fillStyle = "#2f3035";
      context.fillRect(x, y, width, height);
      context.strokeStyle = rgba(accent, 0.28);
      context.lineWidth = 2;
      const spacing = Math.max(54, Math.round(Math.min(width, height) / 10));
      for (let gridX = x - height; gridX < x + width + height; gridX += spacing) {
        context.beginPath();
        context.moveTo(gridX, y);
        context.lineTo(gridX + height, y + height);
        context.stroke();
      }
    }
    context.restore();
  }

  function drawSymbol(type, centerX, centerY, size, color) {
    context.save();
    context.translate(centerX, centerY);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = Math.max(8, size * 0.1);

    if (type === "diamond") {
      context.rotate(Math.PI / 4);
      context.fillRect(-size * 0.34, -size * 0.34, size * 0.68, size * 0.68);
    } else if (type === "cross") {
      context.fillRect(-size * 0.12, -size * 0.46, size * 0.24, size * 0.92);
      context.fillRect(-size * 0.46, -size * 0.12, size * 0.92, size * 0.24);
    } else if (type === "orbit") {
      context.beginPath();
      context.arc(0, 0, size * 0.38, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(size * 0.38, -size * 0.18, size * 0.12, 0, Math.PI * 2);
      context.fill();
    } else {
      context.beginPath();
      context.moveTo(0, -size * 0.5);
      context.lineTo(size * 0.13, -size * 0.13);
      context.lineTo(size * 0.5, 0);
      context.lineTo(size * 0.13, size * 0.13);
      context.lineTo(0, size * 0.5);
      context.lineTo(-size * 0.13, size * 0.13);
      context.lineTo(-size * 0.5, 0);
      context.lineTo(-size * 0.13, -size * 0.13);
      context.closePath();
      context.fill();
    }
    context.restore();
  }

  function drawBrand(x, y, color, markSize) {
    context.textBaseline = "top";
    context.textAlign = "left";

    if (brandMark.complete && brandMark.naturalWidth > 0) {
      context.drawImage(brandMark, x, y, markSize, markSize);
    } else {
      context.fillStyle = color;
      setFont(Math.round(markSize * 0.38), 800, FONT_INTERFACE);
      context.fillText("VIBE QUEST", x, y + Math.round(markSize * 0.2));
    }

    context.fillStyle = color;
    setFont(Math.max(14, Math.round(markSize * 0.2)), 700, FONT_INTERFACE);
    context.fillText("REAL-WORLD DISCOVERY", x, y + markSize + 8);
  }

  function drawFullFrame(copy, accent) {
    drawMedia(0, 0, WIDTH, HEIGHT, accent);
    context.fillStyle = "rgba(8, 10, 14, 0.58)";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = accent;
    context.fillRect(0, 0, 22, HEIGHT);
    drawBrand(72, 48, "#f3e9c4", 88);
    drawSymbol(studio.symbol, 940, 108, 96, accent);

    context.fillStyle = accent;
    setFont(28, 800, FONT_INTERFACE);
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(copy.kicker.toUpperCase(), 72, 650);

    let nextY = drawFittedText(copy.title, {
      x: 72,
      y: 700,
      maxWidth: 900,
      maxLines: 3,
      startSize: 112,
      minSize: 70,
      lineHeight: 0.98,
      color: "#f3e9c4"
    });
    nextY += 28;
    drawFittedText(copy.note, {
      x: 76,
      y: nextY,
      maxWidth: 900,
      maxLines: 5,
      maxHeight: Math.max(72, HEIGHT - 158 - nextY),
      startSize: scaledSubheaderSize(34, copy),
      minSize: 22,
      lineHeight: 1.2,
      weight: 600,
      color: "#f3e9c4"
    });

    context.fillStyle = accent;
    context.fillRect(0, HEIGHT - 122, WIDTH, 122);
    drawSingleLine(copy.details.toUpperCase(), {
      x: 72,
      y: HEIGHT - 61,
      maxWidth: 936,
      startSize: 28,
      minSize: 20,
      color: contrastColor(accent)
    });
  }

  function drawSplitFrame(copy, accent) {
    context.fillStyle = "#f3e9c4";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = "#2f3035";
    context.fillRect(0, 0, WIDTH, 118);
    context.fillStyle = accent;
    context.fillRect(0, 108, WIDTH, 10);
    drawBrand(64, 10, "#f3e9c4", 60);
    drawSymbol(studio.symbol, 950, 55, 72, accent);
    drawMedia(0, 118, WIDTH, 590, accent);

    context.fillStyle = "#2f3035";
    context.fillRect(0, 708, WIDTH, HEIGHT - 708);
    context.fillStyle = accent;
    setFont(26, 800, FONT_INTERFACE);
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(copy.kicker.toUpperCase(), 64, 764);

    let nextY = drawFittedText(copy.title, {
      x: 64,
      y: 806,
      maxWidth: 930,
      maxLines: 3,
      startSize: 88,
      minSize: 60,
      lineHeight: 1,
      color: "#f3e9c4"
    });
    nextY += 20;
    drawFittedText(copy.note, {
      x: 68,
      y: nextY,
      maxWidth: 930,
      maxLines: 5,
      maxHeight: Math.max(72, HEIGHT - 115 - nextY),
      startSize: scaledSubheaderSize(30, copy),
      minSize: 22,
      lineHeight: 1.2,
      weight: 600,
      color: "#f3e9c4"
    });

    drawSingleLine(copy.details.toUpperCase(), {
      x: 64,
      y: HEIGHT - 50,
      maxWidth: 952,
      startSize: 25,
      minSize: 18,
      color: "#f3e9c4",
      baseline: "bottom"
    });
  }

  function drawSignalBlock(copy, accent) {
    drawMedia(0, 0, WIDTH, HEIGHT, accent);
    context.fillStyle = "rgba(10, 12, 16, 0.68)";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    drawBrand(64, 40, "#f3e9c4", 88);

    const panelX = 76;
    const panelY = 250;
    const panelWidth = 928;
    const panelHeight = 850;
    context.fillStyle = "#f3e9c4";
    context.fillRect(panelX, panelY, panelWidth, panelHeight);
    context.fillStyle = accent;
    context.fillRect(panelX, panelY, panelWidth, 24);
    drawSymbol(studio.symbol, panelX + panelWidth - 90, panelY + 105, 108, accent);

    context.fillStyle = "#2f3035";
    setFont(27, 800, FONT_INTERFACE);
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(copy.kicker.toUpperCase(), panelX + 54, panelY + 76);

    let nextY = drawFittedText(copy.title, {
      x: panelX + 54,
      y: panelY + 166,
      maxWidth: panelWidth - 108,
      maxLines: 4,
      startSize: 104,
      minSize: 62,
      lineHeight: 0.96,
      color: "#2f3035"
    });
    nextY += 34;
    drawFittedText(copy.note, {
      x: panelX + 58,
      y: nextY,
      maxWidth: panelWidth - 116,
      maxLines: 5,
      maxHeight: Math.max(72, panelY + panelHeight - 140 - nextY),
      startSize: scaledSubheaderSize(31, copy),
      minSize: 22,
      lineHeight: 1.25,
      weight: 600,
      color: "#2f3035"
    });

    context.fillStyle = accent;
    context.fillRect(panelX, panelY + panelHeight - 112, panelWidth, 112);
    drawSingleLine(copy.details.toUpperCase(), {
      x: panelX + 54,
      y: panelY + panelHeight - 56,
      maxWidth: panelWidth - 108,
      startSize: 25,
      minSize: 18,
      color: contrastColor(accent)
    });

    context.fillStyle = "#f3e9c4";
    setFont(21, 700, FONT_INTERFACE);
    context.textAlign = "left";
    context.textBaseline = "bottom";
    context.fillText("CHOOSE A VIBE. BEGIN THE QUEST.", 76, HEIGHT - 62);
  }

  function render() {
    const copy = flyerCopy();
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, WIDTH, HEIGHT);

    if (studio.layout === "split") {
      drawSplitFrame(copy, studio.accent);
    } else if (studio.layout === "signal") {
      drawSignalBlock(copy, studio.accent);
    } else {
      drawFullFrame(copy, studio.accent);
    }
    context.restore();
  }

  function updateControlState() {
    view.querySelectorAll("[data-flyer-layout]").forEach((button) => {
      const active = button.dataset.flyerLayout === studio.layout;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    view.querySelectorAll("[data-flyer-accent]").forEach((button) => {
      const active = button.dataset.flyerAccent === studio.accent;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    view.querySelectorAll("[data-flyer-symbol]").forEach((button) => {
      const active = button.dataset.flyerSymbol === studio.symbol;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function clearPhoto() {
    studio.photoRequest += 1;
    studio.photo = null;
    if (studio.photoUrl) URL.revokeObjectURL(studio.photoUrl);
    studio.photoUrl = "";
    if (photoInput) photoInput.value = "";
  }

  function loadPhoto(file) {
    const isImage = file instanceof File && (
      String(file.type || "").startsWith("image/")
      || /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i.test(String(file.name || ""))
    );
    if (!isImage) {
      setStatus("Choose a JPG, HEIC, PNG, or WebP photo.", true);
      return;
    }

    const request = ++studio.photoRequest;
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.addEventListener("load", () => {
      if (request !== studio.photoRequest) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      if (studio.photoUrl) URL.revokeObjectURL(studio.photoUrl);
      studio.photo = image;
      studio.photoUrl = objectUrl;
      setStatus("Photo added. It stays on this device.");
      render();
    });
    image.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      if (request === studio.photoRequest) {
        setStatus("That photo could not be opened. Try a standard JPG, HEIC, PNG, or WebP file.", true);
      }
    });
    image.src = objectUrl;
  }

  function resetStudio() {
    form.reset();
    clearPhoto();
    studio.layout = DEFAULTS.layout;
    studio.accent = DEFAULTS.accent;
    studio.symbol = DEFAULTS.symbol;
    updateNoteCount();
    updateSubheaderSizeOutput();
    updateControlState();
    setStatus("Your photo stays on this device.");
    render();
  }

  function downloadFlyer() {
    render();
    setStatus("Preparing your 1080 × 1350 flyer...");
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("The flyer could not be downloaded in this browser.", true);
        return;
      }
      const title = flyerCopy().title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50) || "vibe-quest-flyer";
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${title}-vibe-quest.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus("Flyer downloaded. Get it out there.");
    }, "image/png");
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", (event) => {
    if (event.target === photoInput) return;
    if (event.target === noteInput) updateNoteCount();
    if (event.target === subheaderSizeInput) updateSubheaderSizeOutput();
    render();
  });
  photoInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) loadPhoto(file);
  });

  dropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragover");
  });
  dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("is-dragover"));
  dropZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragover");
    const file = event.dataTransfer?.files?.[0];
    if (file) loadPhoto(file);
  });

  view.addEventListener("click", (event) => {
    const target = event.target.closest("[data-flyer-layout], [data-flyer-accent], [data-flyer-symbol], [data-flyer-action]");
    if (!target) return;
    if (target.dataset.flyerLayout) studio.layout = target.dataset.flyerLayout;
    if (target.dataset.flyerAccent) studio.accent = target.dataset.flyerAccent;
    if (target.dataset.flyerSymbol) studio.symbol = target.dataset.flyerSymbol;
    if (target.dataset.flyerAction === "reset") {
      resetStudio();
      return;
    }
    if (target.dataset.flyerAction === "download") {
      downloadFlyer();
      return;
    }
    updateControlState();
    render();
  });

  window.addEventListener("beforeunload", () => {
    if (studio.photoUrl) URL.revokeObjectURL(studio.photoUrl);
  });

  window.vvFlyerStudio = { render };
  brandMark.addEventListener("load", render);
  brandMark.src = BRAND_MARK_URL;
  updateNoteCount();
  updateSubheaderSizeOutput();
  updateControlState();
  render();
  document.fonts?.ready.then(render).catch(() => {});
})();
