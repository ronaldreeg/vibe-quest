(() => {
  "use strict";

  const WIDTH = 1080;
  const HEIGHT = 1350;
  const MAX_POINTS = 5;
  const FONT_READING = '"Faculty Glyphic", Georgia, serif';
  const FONT_INTERFACE = '"VT323", monospace';
  const BRAND_MARK_URL = "./assets/brand/logo-mark-signal.svg?v=20260911-flyer-v2";
  const COLORS = {
    charcoal: "#2f3035",
    charcoalDeep: "#22242a",
    cream: "#f3e9c4",
    orange: "#fa622e",
    yellow: "#f8d23d",
    pink: "#f45077",
    teal: "#0f8fb1"
  };
  const DEFAULT_POINTS = [
    { name: "First light coffee", note: "Start slow with something local and strong." },
    { name: "Market treasure hunt", note: "Find one thing you did not know you needed." },
    { name: "Sunset by the water", note: "Finish where the sky does most of the talking." }
  ];
  const WORKSHOP_COPY = {
    flyer: {
      eyebrow: "Quest Flyer Studio",
      title: "Make a flyer worth sharing.",
      intro: "Turn your photo and event details into a Vibe Quest flyer built for the feed, the group chat, and wherever your people are looking."
    },
    vibetinerary: {
      eyebrow: "Vibetinerary Studio",
      title: "Map a day worth taking.",
      intro: "Bundle a few good finds into one shareable route. Build a clear stop list or turn the day into a stylized, non-geographic treasure map."
    },
    "vibe-code": {
      eyebrow: "Vibe Code Generator",
      title: "Turn a link into a signal.",
      intro: "Make a branded code for a quest, map, sign-up page, menu, or anywhere else worth sending people."
    }
  };

  const view = document.querySelector("#shareView");
  const form = document.querySelector("#vibetineraryForm");
  const canvas = document.querySelector("#vibetineraryCanvas");
  const pointsContainer = document.querySelector("#vibetineraryPoints");
  const pointCount = document.querySelector("#vibetineraryPointCount");
  const photoInput = document.querySelector("#vibetineraryPhotoInput");
  const backgroundLabel = document.querySelector("[data-vibetinerary-background-label]");
  const backgroundHint = document.querySelector("[data-vibetinerary-background-hint]");
  const status = document.querySelector("#vibetineraryStatus");
  if (!view || !form || !pointsContainer || !(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;

  const brandMark = new Image();
  brandMark.decoding = "async";
  const studio = {
    workshopMode: "flyer",
    layout: "list",
    accent: COLORS.yellow,
    points: DEFAULT_POINTS.map((point) => ({ ...point })),
    photo: null,
    photoUrl: "",
    photoRequest: 0
  };

  function rgba(hex, alpha) {
    const normalized = String(hex).replace("#", "").padEnd(6, "0").slice(0, 6);
    const value = Number.parseInt(normalized, 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }

  function contrastColor(hex) {
    const value = Number.parseInt(String(hex).replace("#", "").padEnd(6, "0").slice(0, 6), 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? COLORS.charcoal : COLORS.cream;
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

  function fittedLines(text, maxWidth, maxLines, startSize, minSize, weight = 700, family = FONT_READING) {
    let size = startSize;
    let lines = [];
    while (size >= minSize) {
      setFont(size, weight, family);
      lines = wrapLines(text, maxWidth);
      if (lines.length <= maxLines) return { lines, size };
      size -= 2;
    }
    setFont(minSize, weight, family);
    const wrapped = wrapLines(text, maxWidth);
    lines = wrapped.slice(0, maxLines);
    if (wrapped.length > maxLines) {
      let last = lines[maxLines - 1];
      while (last && context.measureText(`${last}...`).width > maxWidth) last = last.slice(0, -1).trim();
      lines[maxLines - 1] = `${last}...`;
    }
    return { lines, size: minSize };
  }

  function drawText(text, options) {
    const result = fittedLines(
      text,
      options.maxWidth,
      options.maxLines,
      options.startSize,
      options.minSize,
      options.weight,
      options.family
    );
    const lineHeight = result.size * (options.lineHeight || 1.08);
    setFont(result.size, options.weight, options.family);
    context.fillStyle = options.color;
    context.textAlign = options.align || "left";
    context.textBaseline = "top";
    result.lines.forEach((line, index) => context.fillText(line, options.x, options.y + index * lineHeight));
    return options.y + result.lines.length * lineHeight;
  }

  function drawSingleLine(text, x, y, maxWidth, size, minSize, color, align = "left") {
    let fittedSize = size;
    while (fittedSize > minSize) {
      setFont(fittedSize, 700, FONT_INTERFACE);
      if (context.measureText(text).width <= maxWidth) break;
      fittedSize -= 1;
    }
    setFont(fittedSize, 700, FONT_INTERFACE);
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = "top";
    context.fillText(text, x, y, maxWidth);
  }

  function drawBrand(x, y, size) {
    if (brandMark.complete && brandMark.naturalWidth > 0) {
      context.drawImage(brandMark, x, y, size, size);
      return;
    }
    drawSingleLine("VIBE QUEST", x, y + 8, size * 1.6, 34, 24, COLORS.cream);
    drawSingleLine("REAL-WORLD DISCOVERY", x, y + 48, size * 1.6, 16, 12, COLORS.cream);
  }

  function drawPhotoCover(image, x, y, width, height) {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    context.drawImage(
      image,
      x + (width - drawWidth) / 2,
      y + (height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );
  }

  function drawBackground(overlayOpacity) {
    context.fillStyle = COLORS.charcoal;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    if (!studio.photo) return;

    drawPhotoCover(studio.photo, 0, 0, WIDTH, HEIGHT);
    context.fillStyle = rgba(COLORS.charcoal, overlayOpacity);
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function fieldValue(name, fallback) {
    const field = form.elements.namedItem(name);
    return String(field?.value || fallback).trim();
  }

  function itineraryCopy() {
    return {
      title: fieldValue("vibetineraryTitle", "A day worth wandering"),
      intro: fieldValue("vibetineraryIntro", "Follow the good signs."),
      points: studio.points.map((point, index) => ({
        name: String(point.name || `Point ${index + 1}`).trim(),
        note: String(point.note || "A good place to wander.").trim()
      }))
    };
  }

  function drawListLayout(copy) {
    const accent = studio.accent;
    drawBackground(0.72);
    context.fillStyle = accent;
    context.fillRect(0, 0, 22, HEIGHT);
    drawBrand(58, 28, 148);
    drawSingleLine("VIBETINERARY / VIBE COMBO", 252, 75, 740, 28, 19, accent);
    drawSingleLine(`${copy.points.length} POINT${copy.points.length === 1 ? "" : "S"} / ONE GOOD DAY`, 252, 112, 740, 22, 16, COLORS.cream);

    const titleEnd = drawText(copy.title, {
      x: 64,
      y: 220,
      maxWidth: 930,
      maxLines: 2,
      startSize: 92,
      minSize: 62,
      lineHeight: 0.98,
      weight: 700,
      family: FONT_READING,
      color: COLORS.cream
    });
    const introEnd = drawText(copy.intro, {
      x: 68,
      y: titleEnd + 24,
      maxWidth: 870,
      maxLines: 3,
      startSize: 28,
      minSize: 22,
      lineHeight: 1.2,
      weight: 600,
      family: FONT_READING,
      color: rgba(COLORS.cream, 0.82)
    });

    const startY = Math.max(495, introEnd + 44);
    const endY = 1190;
    const rowHeight = Math.min(142, (endY - startY) / copy.points.length);
    context.strokeStyle = rgba(COLORS.cream, 0.22);
    context.lineWidth = 2;

    copy.points.forEach((point, index) => {
      const rowY = startY + rowHeight * index;
      const numberSize = Math.min(78, rowHeight - 24);
      context.beginPath();
      context.moveTo(64, rowY);
      context.lineTo(1016, rowY);
      context.stroke();

      context.fillStyle = index % 2 === 0 ? accent : rgba(accent, 0.72);
      context.fillRect(64, rowY + 12, numberSize, numberSize);
      drawSingleLine(String(index + 1).padStart(2, "0"), 64 + numberSize / 2, rowY + 25, numberSize, 30, 22, contrastColor(accent), "center");

      const textX = 64 + numberSize + 28;
      drawText(point.name, {
        x: textX,
        y: rowY + 13,
        maxWidth: 1016 - textX,
        maxLines: 1,
        startSize: 38,
        minSize: 27,
        lineHeight: 1,
        weight: 700,
        family: FONT_READING,
        color: COLORS.cream
      });
      drawText(point.note, {
        x: textX,
        y: rowY + 59,
        maxWidth: 1016 - textX,
        maxLines: rowHeight < 125 ? 1 : 2,
        startSize: 23,
        minSize: 18,
        lineHeight: 1.16,
        weight: 500,
        family: FONT_READING,
        color: rgba(COLORS.cream, 0.76)
      });
    });

    context.beginPath();
    context.moveTo(64, startY + rowHeight * copy.points.length);
    context.lineTo(1016, startY + rowHeight * copy.points.length);
    context.stroke();
    context.fillStyle = accent;
    context.fillRect(0, HEIGHT - 112, WIDTH, 112);
    drawSingleLine("CHOOSE A VIBE. BEGIN THE QUEST.", 64, HEIGHT - 78, 952, 26, 18, contrastColor(accent));
  }

  function regularPolygonPoints(count, centerX = 540, centerY = 850, radius = 260) {
    return Array.from({ length: count }, (_, index) => {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / count);
      return [
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      ];
    });
  }

  function mapPlacements(count) {
    if (count === 1) return [{ point: [540, 820], label: [398, 650] }];
    if (count === 2) {
      return [
        { point: [300, 700], label: [70, 530] },
        { point: [780, 1000], label: [725, 830] }
      ];
    }

    const labels = {
      3: [[398, 440], [725, 835], [70, 835]],
      4: [[398, 440], [725, 690], [398, 960], [70, 690]],
      5: [[398, 440], [725, 600], [725, 890], [70, 890], [70, 600]]
    };
    const safeCount = Math.max(3, Math.min(MAX_POINTS, count));
    return regularPolygonPoints(safeCount).map((point, index) => ({
      point,
      label: labels[safeCount][index]
    }));
  }

  function drawMapTexture(mapTop, mapBottom, accent) {
    context.save();
    context.beginPath();
    context.rect(46, mapTop, 988, mapBottom - mapTop);
    context.clip();

    const mapLeft = 46;
    const mapRight = 1034;
    const cellSize = 52;
    context.strokeStyle = rgba(COLORS.cream, 0.075);
    context.lineWidth = 1.5;
    context.beginPath();
    for (let x = mapLeft; x <= mapRight; x += cellSize) {
      context.moveTo(x, mapTop);
      context.lineTo(x, mapBottom);
    }
    for (let y = mapTop; y <= mapBottom; y += cellSize) {
      context.moveTo(mapLeft, y);
      context.lineTo(mapRight, y);
    }
    context.stroke();

    context.strokeStyle = rgba(accent, 0.065);
    context.lineWidth = 2;
    context.beginPath();
    for (let x = mapLeft; x <= mapRight; x += cellSize * 4) {
      context.moveTo(x, mapTop);
      context.lineTo(x, mapBottom);
    }
    for (let y = mapTop; y <= mapBottom; y += cellSize * 4) {
      context.moveTo(mapLeft, y);
      context.lineTo(mapRight, y);
    }
    context.stroke();
    context.restore();
  }

  function drawRoute(placements, accent) {
    if (placements.length < 2) return;
    context.save();
    context.strokeStyle = accent;
    context.lineWidth = 8;
    context.setLineDash([18, 14]);
    context.beginPath();
    placements.forEach(({ point }, index) => {
      if (index === 0) {
        context.moveTo(point[0], point[1]);
        return;
      }
      const previous = placements[index - 1].point;
      const midX = (previous[0] + point[0]) / 2;
      context.bezierCurveTo(midX, previous[1], midX, point[1], point[0], point[1]);
    });
    context.stroke();
    context.restore();
  }

  function drawMapLabel(point, placement, index, accent) {
    const [labelX, labelY] = placement.label;
    const labelWidth = 285;
    const labelHeight = 126;
    const [pointX, pointY] = placement.point;

    context.strokeStyle = rgba(accent, 0.68);
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(pointX, pointY);
    context.lineTo(Math.max(labelX, Math.min(pointX, labelX + labelWidth)), Math.max(labelY, Math.min(pointY, labelY + labelHeight)));
    context.stroke();

    context.fillStyle = COLORS.charcoal;
    context.fillRect(labelX, labelY, labelWidth, labelHeight);
    context.strokeStyle = rgba(COLORS.cream, 0.3);
    context.strokeRect(labelX, labelY, labelWidth, labelHeight);
    context.fillStyle = accent;
    context.fillRect(labelX, labelY, 42, 42);
    drawSingleLine(String(index + 1), labelX + 21, labelY + 8, 38, 25, 20, contrastColor(accent), "center");
    drawText(point.name, {
      x: labelX + 54,
      y: labelY + 9,
      maxWidth: labelWidth - 64,
      maxLines: 1,
      startSize: 25,
      minSize: 18,
      lineHeight: 1,
      weight: 700,
      family: FONT_READING,
      color: COLORS.cream
    });
    drawText(point.note, {
      x: labelX + 18,
      y: labelY + 57,
      maxWidth: labelWidth - 36,
      maxLines: 2,
      startSize: 18,
      minSize: 15,
      lineHeight: 1.16,
      weight: 500,
      family: FONT_READING,
      color: rgba(COLORS.cream, 0.72)
    });

    context.fillStyle = accent;
    context.fillRect(pointX - 18, pointY - 18, 36, 36);
    context.strokeStyle = COLORS.cream;
    context.lineWidth = 5;
    context.strokeRect(pointX - 18, pointY - 18, 36, 36);
  }

  function drawMapLayout(copy) {
    const accent = studio.accent;
    context.fillStyle = COLORS.charcoal;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    drawBrand(54, 26, 138);
    drawSingleLine("VIBETINERARY / TREASURE MAP", 232, 68, 770, 28, 19, accent);
    drawSingleLine("PLAYFUL ROUTE / NOT TO SCALE", 232, 108, 770, 21, 15, COLORS.cream);

    const titleEnd = drawText(copy.title, {
      x: 58,
      y: 190,
      maxWidth: 960,
      maxLines: 2,
      startSize: 78,
      minSize: 54,
      lineHeight: 0.98,
      weight: 700,
      family: FONT_READING,
      color: COLORS.cream
    });
    drawText(copy.intro, {
      x: 62,
      y: titleEnd + 20,
      maxWidth: 910,
      maxLines: 2,
      startSize: 25,
      minSize: 20,
      lineHeight: 1.18,
      weight: 500,
      family: FONT_READING,
      color: rgba(COLORS.cream, 0.78)
    });

    const mapTop = 420;
    const mapBottom = 1190;
    context.fillStyle = COLORS.charcoalDeep;
    context.fillRect(46, mapTop, 988, mapBottom - mapTop);
    if (studio.photo) {
      context.save();
      context.beginPath();
      context.rect(46, mapTop, 988, mapBottom - mapTop);
      context.clip();
      drawPhotoCover(studio.photo, 46, mapTop, 988, mapBottom - mapTop);
      context.fillStyle = rgba(COLORS.charcoalDeep, 0.66);
      context.fillRect(46, mapTop, 988, mapBottom - mapTop);
      context.fillStyle = rgba(accent, 0.06);
      context.fillRect(46, mapTop, 988, mapBottom - mapTop);
      context.restore();
    }
    context.strokeStyle = accent;
    context.lineWidth = 4;
    context.strokeRect(46, mapTop, 988, mapBottom - mapTop);
    drawMapTexture(mapTop, mapBottom, accent);

    const placements = mapPlacements(copy.points.length);
    drawRoute(placements, accent);
    copy.points.forEach((point, index) => drawMapLabel(point, placements[index], index, accent));

    context.fillStyle = accent;
    context.fillRect(46, 1190, 988, 104);
    drawSingleLine("FOLLOW THE SIGNS. WANDER WELL.", 78, 1225, 850, 25, 18, contrastColor(accent));
    drawSingleLine(`${copy.points.length} / ${MAX_POINTS}`, 990, 1225, 90, 25, 18, contrastColor(accent), "right");
  }

  function render() {
    const copy = itineraryCopy();
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (studio.layout === "map") drawMapLayout(copy);
    else drawListLayout(copy);
    context.restore();
  }

  function createPointEditor(point, index) {
    const row = document.createElement("div");
    row.className = "vibetinerary-point";
    row.dataset.vibetineraryPoint = String(index);

    const number = document.createElement("span");
    number.className = "vibetinerary-point-number";
    number.textContent = String(index + 1).padStart(2, "0");
    row.appendChild(number);

    const fields = document.createElement("div");
    fields.className = "vibetinerary-point-fields";
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Point name";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.maxLength = 42;
    nameInput.value = point.name;
    nameInput.placeholder = "Coffee, market, trail...";
    nameInput.dataset.pointField = "name";
    nameLabel.appendChild(nameInput);
    const noteLabel = document.createElement("label");
    noteLabel.textContent = "Little blurb";
    const noteInput = document.createElement("textarea");
    noteInput.maxLength = 90;
    noteInput.rows = 2;
    noteInput.value = point.note;
    noteInput.placeholder = "What makes this stop worth it?";
    noteInput.dataset.pointField = "note";
    noteLabel.appendChild(noteInput);
    fields.append(nameLabel, noteLabel);
    row.appendChild(fields);

    const remove = document.createElement("button");
    remove.className = "vibetinerary-remove-point";
    remove.type = "button";
    remove.dataset.vibetineraryRemove = String(index);
    remove.setAttribute("aria-label", `Remove point ${index + 1}`);
    remove.title = `Remove point ${index + 1}`;
    remove.textContent = "x";
    remove.disabled = studio.points.length === 1;
    row.appendChild(remove);
    return row;
  }

  function renderPointEditors() {
    pointsContainer.replaceChildren(...studio.points.map(createPointEditor));
    if (pointCount) pointCount.value = `${studio.points.length} / ${MAX_POINTS}`;
    const addButton = view.querySelector('[data-vibetinerary-action="add"]');
    if (addButton) addButton.disabled = studio.points.length >= MAX_POINTS;
  }

  function updateControlState() {
    const isTreasureMap = studio.layout === "map";
    view.querySelectorAll("[data-workshop-mode]").forEach((button) => {
      const active = button.dataset.workshopMode === studio.workshopMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    view.querySelectorAll("[data-vibetinerary-layout]").forEach((button) => {
      const active = button.dataset.vibetineraryLayout === studio.layout;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    view.querySelectorAll("[data-vibetinerary-accent]").forEach((button) => {
      const active = button.dataset.vibetineraryAccent === studio.accent;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (backgroundLabel) {
      backgroundLabel.textContent = isTreasureMap
        ? "Treasure map background (optional)"
        : "Background image (optional)";
    }
    if (backgroundHint) {
      backgroundHint.textContent = isTreasureMap
        ? "Adds a subtle photo beneath the illustrated route. This is a playful layout, not a geographic map."
        : "Adds a soft full-frame image behind the stop list.";
    }
  }

  function setWorkshopMode(mode) {
    studio.workshopMode = ["flyer", "vibetinerary", "vibe-code"].includes(mode) ? mode : "flyer";
    view.querySelectorAll("[data-workshop-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.workshopPanel !== studio.workshopMode;
    });
    const copy = WORKSHOP_COPY[studio.workshopMode];
    const eyebrow = document.querySelector("#workshopEyebrow");
    const title = document.querySelector("#workshopTitle");
    const intro = document.querySelector("#workshopIntro");
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (intro) intro.textContent = copy.intro;
    updateControlState();
    if (studio.workshopMode === "vibetinerary") render();
    else if (studio.workshopMode === "vibe-code") window.vvVibeCodeStudio?.render();
    else window.vvFlyerStudio?.render();
  }

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function clearPhoto() {
    studio.photoRequest += 1;
    studio.photo = null;
    if (studio.photoUrl) URL.revokeObjectURL(studio.photoUrl);
    studio.photoUrl = "";
    if (photoInput) photoInput.value = "";
    const removeButton = view.querySelector('[data-vibetinerary-action="clear-photo"]');
    if (removeButton) removeButton.hidden = true;
  }

  function loadPhoto(file) {
    const isImage = file instanceof File && (
      String(file.type || "").startsWith("image/")
      || /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i.test(String(file.name || ""))
    );
    if (!isImage) {
      setStatus("Choose a JPG, HEIC, PNG, or WebP background image.", true);
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
      const removeButton = view.querySelector('[data-vibetinerary-action="clear-photo"]');
      if (removeButton) removeButton.hidden = false;
      setStatus(studio.layout === "map"
        ? "Subtle treasure-map background added. It stays on this device."
        : "Background added. It stays on this device.");
      render();
    });
    image.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      if (request === studio.photoRequest) {
        setStatus("That image could not be opened. Try a standard JPG, PNG, or WebP file.", true);
      }
    });
    image.src = objectUrl;
  }

  function reset() {
    form.reset();
    clearPhoto();
    studio.layout = "list";
    studio.accent = COLORS.yellow;
    studio.points = DEFAULT_POINTS.map((point) => ({ ...point }));
    renderPointEditors();
    updateControlState();
    setStatus("Build a route with up to five points.");
    render();
  }

  function download() {
    render();
    if (status) status.textContent = "Preparing your 1080 x 1350 Vibetinerary...";
    canvas.toBlob((blob) => {
      if (!blob) {
        if (status) status.textContent = "This browser could not download the Vibetinerary.";
        return;
      }
      const slug = itineraryCopy().title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50) || "vibetinerary";
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${slug}-vibetinerary.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      if (status) status.textContent = "Vibetinerary downloaded. Send out the route.";
    }, "image/png");
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", (event) => {
    if (event.target === photoInput) return;
    const row = event.target.closest("[data-vibetinerary-point]");
    const field = event.target.dataset.pointField;
    if (row && field) {
      const index = Number(row.dataset.vibetineraryPoint);
      if (studio.points[index]) studio.points[index][field] = event.target.value;
    }
    render();
  });
  photoInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) loadPhoto(file);
  });

  view.addEventListener("click", (event) => {
    const target = event.target.closest("[data-workshop-mode], [data-vibetinerary-layout], [data-vibetinerary-accent], [data-vibetinerary-action], [data-vibetinerary-remove]");
    if (!target) return;
    if (target.dataset.workshopMode) {
      setWorkshopMode(target.dataset.workshopMode);
      return;
    }
    if (target.dataset.vibetineraryLayout) studio.layout = target.dataset.vibetineraryLayout;
    if (target.dataset.vibetineraryAccent) studio.accent = target.dataset.vibetineraryAccent;
    if (target.dataset.vibetineraryAction === "add" && studio.points.length < MAX_POINTS) {
      studio.points.push({ name: `New point ${studio.points.length + 1}`, note: "Add a small reason to stop here." });
      renderPointEditors();
    }
    if (target.dataset.vibetineraryAction === "clear-photo") {
      clearPhoto();
      setStatus("Background removed. Your itinerary is unchanged.");
      render();
      return;
    }
    if (target.dataset.vibetineraryRemove !== undefined && studio.points.length > 1) {
      studio.points.splice(Number(target.dataset.vibetineraryRemove), 1);
      renderPointEditors();
    }
    if (target.dataset.vibetineraryAction === "reset") {
      reset();
      return;
    }
    if (target.dataset.vibetineraryAction === "download") {
      download();
      return;
    }
    updateControlState();
    render();
  });

  window.vvVibetineraryStudio = { render, setWorkshopMode };
  window.addEventListener("beforeunload", () => {
    if (studio.photoUrl) URL.revokeObjectURL(studio.photoUrl);
  });
  brandMark.addEventListener("load", render);
  brandMark.src = BRAND_MARK_URL;
  renderPointEditors();
  updateControlState();
  render();
  document.fonts?.ready.then(render).catch(() => {});
})();
