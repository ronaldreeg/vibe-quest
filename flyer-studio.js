(() => {
  "use strict";

  const WIDTH = 1080;
  const HEIGHT = 1350;
  const DEFAULTS = {
    layout: "full",
    accent: "#f8d23d",
    symbol: "spark"
  };

  const view = document.querySelector("#shareView");
  const form = document.querySelector("#flyerForm");
  const canvas = document.querySelector("#flyerCanvas");
  const photoInput = document.querySelector("#flyerPhotoInput");
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
    return {
      title: fieldValue("flyerTitle", "Untitled Quest"),
      kicker: fieldValue("flyerKicker", "A Vibe Quest"),
      details: fieldValue("flyerDetails", "Somewhere worth going"),
      note: fieldValue("flyerNote", "Show up curious.")
    };
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

  function setFont(size, weight = 800) {
    context.font = `${weight} ${size}px Inter, Arial, sans-serif`;
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

  function fittedLines(text, maxWidth, maxLines, startSize, minSize, weight = 800) {
    let size = startSize;
    let lines = [];
    while (size >= minSize) {
      setFont(size, weight);
      lines = wrapLines(text, maxWidth);
      if (lines.length <= maxLines) return { lines, size };
      size -= 2;
    }
    setFont(minSize, weight);
    lines = wrapLines(text, maxWidth).slice(0, maxLines);
    if (wrapLines(text, maxWidth).length > maxLines) {
      let finalLine = lines[maxLines - 1];
      while (finalLine && context.measureText(`${finalLine}...`).width > maxWidth) {
        finalLine = finalLine.slice(0, -1).trim();
      }
      lines[maxLines - 1] = `${finalLine}...`;
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
      options.weight || 800
    );
    setFont(result.size, options.weight || 800);
    const lineHeight = result.size * (options.lineHeight || 1);
    return drawLines(result.lines, options.x, options.y, lineHeight, options.color, options.align);
  }

  function drawSingleLine(text, options) {
    let size = options.startSize;
    const value = String(text || "");
    while (size > options.minSize) {
      setFont(size, options.weight || 800);
      if (context.measureText(value).width <= options.maxWidth) break;
      size -= 1;
    }
    setFont(size, options.weight || 800);
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
      context.fillStyle = accent;
      context.fillRect(x + width * 0.62, y, width * 0.38, height * 0.34);
      context.fillStyle = "#f3e9c4";
      context.fillRect(x, y + height * 0.76, width * 0.46, height * 0.24);
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

  function drawBrand(x, y, color, align = "left") {
    context.textAlign = align;
    context.textBaseline = "top";
    context.fillStyle = color;
    setFont(34, 800);
    context.fillText("VIBE QUEST", x, y);
    setFont(18, 700);
    context.fillText("REAL-WORLD DISCOVERY", x, y + 44);
  }

  function drawFullFrame(copy, accent) {
    drawMedia(0, 0, WIDTH, HEIGHT, accent);
    context.fillStyle = "rgba(8, 10, 14, 0.58)";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = accent;
    context.fillRect(0, 0, 22, HEIGHT);
    drawBrand(72, 64, "#f3e9c4");
    drawSymbol(studio.symbol, 940, 108, 96, accent);

    context.fillStyle = accent;
    setFont(28, 800);
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
      maxWidth: 780,
      maxLines: nextY > 1040 ? 1 : 2,
      startSize: 34,
      minSize: 28,
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
    context.fillStyle = accent;
    context.fillRect(0, 0, WIDTH, 118);
    drawBrand(64, 24, contrastColor(accent));
    drawSymbol(studio.symbol, 950, 59, 72, contrastColor(accent));
    drawMedia(0, 118, WIDTH, 590, accent);

    context.fillStyle = "#2f3035";
    context.fillRect(0, 708, WIDTH, HEIGHT - 708);
    context.fillStyle = accent;
    setFont(26, 800);
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
      maxWidth: 780,
      maxLines: nextY > 1110 ? 1 : 2,
      startSize: 30,
      minSize: 25,
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
    drawBrand(64, 54, "#f3e9c4");

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
    setFont(27, 800);
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
      maxWidth: panelWidth - 180,
      maxLines: nextY > panelY + 660 ? 2 : 3,
      startSize: 31,
      minSize: 25,
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
    setFont(21, 700);
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
  updateControlState();
  render();
  document.fonts?.ready.then(render).catch(() => {});
})();
