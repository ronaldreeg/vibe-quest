(() => {
  "use strict";
  const panel = document.querySelector('[data-workshop-panel="icon"]');
  const canvas = document.querySelector('#iconCanvas');
  const preview = document.querySelector('#iconSmallPreview');
  if (!panel || !canvas || !preview) return;
  const ctx = canvas.getContext('2d');
  const previewCtx = preview.getContext('2d');
  // Keep the placement guide separate from the art, badge preview and PNG export.
  const guide = document.createElement('canvas');
  guide.width = guide.height = 512; guide.setAttribute('aria-hidden', 'true');
  Object.assign(guide.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' });
  canvas.parentElement.style.position = 'relative';
  canvas.parentElement.appendChild(guide);
  const guideCtx = guide.getContext('2d');
  const guideMask = document.createElement('canvas'); guideMask.width = guideMask.height = 512;
  const guideWhite = document.createElement('canvas'); guideWhite.width = guideWhite.height = 512;
  const status = document.querySelector('#iconStatus');
  const upload = document.querySelector('#iconUpload');
  const uploadControls = document.querySelector('#iconUploadControls');
  const cropX = document.querySelector('#iconCropX');
  const cropY = document.querySelector('#iconCropY');
  const pixelate = document.querySelector('#iconPixelate');
  const custom = document.querySelector('#iconCustomColor');
  const brushSize = document.querySelector('#iconBrushSize');
  const brushSizeValue = document.querySelector('#iconBrushSizeValue');
  const brushStretch = document.querySelector('#iconBrushStretch');
  const outputHint = document.querySelector('#iconOutputHint');
  const backgroundOptions = document.querySelector('#iconPhotoBackground');
  const previewLabel = document.querySelector('#iconPreviewLabel');
  const C = { o: '#fa622e', y: '#f8d23d', c: '#f3e9c4', t: '#0f8fb1', d: '#2f3035', p: '#f45077', v: '#9da962' };
  const patterns = {
    spark: ['................','.......yy.......','.......yy.......','......yyyy......','......yyyy......','.....yyyyyy.....','..yyyyyyyyyyyy..','..yyyyyyyyyyyy..','.....yyyyyy.....','......yyyy......','......yyyy......','.......yy.......','.......yy.......','................','................','................'],
    mushroom: ['................','.....oooooo.....','...oooooooooo...','..oooccoooccoo..','.ooooccoooccooo.','.oooooooooooooo.','.oooccooooocooo.','.oooccooooocooo.','..oooooooooooo..','....cccccccc....','.....cccccc.....','.....ccddcc.....','.....cccccc.....','....cccccccc....','................','................'],
    tent: ['................','.......yy.......','.......yy.......','......ytty......','......yttty.....','.....yttttty....','.....yttttty....','....yttttttty...','....yttttttty...','...ytttdttttty..','...yttdddtttty..','..yttdddddtttty.','.yyyyyyyyyyyyyy.','................','................','................'],
    heart: ['................','................','...pppp..pppp...','..pppppppppppp..','.pppppppppppppp.','.pppppppppppppp.','.pppppppppppppp.','..pppppppppppp..','...pppppppppp...','....pppppppp....','.....pppppp.....','......pppp......','.......pp.......','................','................','................'],
    blank: Array(16).fill('................')
  };
  const state = { destination: 'badge', photoBackground: '#2f3035', size: 16, pixels: [], color: C.o, shape: 'square', rotation: 0, stampSize: '1x1', tool: 'pencil', history: [], image: null, pointer: false, lastPoint: null, cursorX: 7, cursorY: 7, keyboard: false, hover: null, uploadRequest: 0 };
  const shapes = ['square', 'triangle', 'circle', 'semicircle', 'quarter', 'curved'];
  function say(text) { status.textContent = text; }
  function piece(color, shape = 'square', rotation = 0, x = 0, y = 0, cols = 1, rows = 1) { return { color, shape, rotation, x, y, cols, rows }; }
  // These starters use the same editable pieces as the shape brush. The eight-cell
  // design grid scales evenly to each supported canvas size.
  const shapeStarters = {
    sunrise: [
      ['y', 'circle', 0, 2, 1, 4, 4],
      ['o', 'triangle', 270, 1, 4, 2, 2],
      ['o', 'triangle', 0, 3, 4, 2, 2],
      ['p', 'triangle', 270, 3, 4, 2, 2],
      ['p', 'triangle', 0, 5, 4, 2, 2],
      ['t', 'square', 0, 1, 6, 6, 1]
    ],
    flower: [
      ['t', 'square', 0, 3, 4, 2, 3],
      ['t', 'triangle', 270, 2, 5, 1, 1],
      ['t', 'triangle', 0, 5, 5, 1, 1],
      ['p', 'circle', 0, 3, 1, 2, 2],
      ['p', 'circle', 0, 2, 2, 2, 2],
      ['p', 'circle', 0, 4, 2, 2, 2],
      ['p', 'circle', 0, 3, 3, 2, 2],
      ['y', 'circle', 0, 3, 2, 2, 2]
    ],
    planet: [
      ['c', 'circle', 0, 1, 3, 6, 2],
      ['t', 'circle', 0, 2, 2, 4, 4],
      ['p', 'circle', 0, 4, 3, 1, 1],
      ['y', 'square', 0, 1, 1, 1, 1],
      ['y', 'square', 0, 6, 6, 1, 1]
    ],
    vibe: [
      // A single scalable word, split into editable cells by the normal stamp
      // renderer. Its fine letterforms survive even the eight-cell grid.
      ['o', 'vibe-word', 0, 0, 0, 8, 8]
    ],
    q: [
      // Sixteen-cell reference: a yellow field and one clipped, editable Q.
      ['y', 'square', 0, 0, 0, 8, 8],
      ['o', 'q-reference', 0, 0, 0, 8, 8]
    ],
    cactus: [
      ['v', 'circle', 0, 3, 1, 2, 2],
      ['v', 'square', 0, 3, 2, 2, 4],
      ['v', 'circle', 0, 1, 3, 2, 2],
      ['v', 'square', 0, 2, 4, 2, 1],
      ['v', 'circle', 0, 5, 2, 2, 2],
      ['v', 'square', 0, 4, 3, 2, 1],
      ['y', 'circle', 0, 3, 0, 2, 2],
      ['p', 'square', 0, 2, 5, 4, 2],
      ['c', 'square', 0, 2, 5, 4, 1]
    ]
  };
  function pixelsFromTemplate(name, size) {
    if (shapeStarters[name]) {
      const pixels = Array(size * size).fill(null), scale = size / 8;
      shapeStarters[name].forEach(([color, shape, rotation, left, top, width, height]) => {
        const x = left * scale, y = top * scale, cols = width * scale, rows = height * scale;
        for (let dy = 0; dy < rows; dy++) for (let dx = 0; dx < cols; dx++) {
          const index = (y + dy) * size + x + dx;
          pixels[index] = { ...piece(C[color], shape, rotation, dx, dy, cols, rows), under: pixels[index] };
        }
      });
      if (name === 'q') {
        // A shared background mask lets Fill recolor the visible yellow field,
        // including transparent corners inside the orange stamp's bounding box.
        const mask = document.createElement('canvas'); mask.width = mask.height = 512;
        const context = mask.getContext('2d'); context.fillRect(0, 0, 512, 512);
        pixels.forEach(p => { p.under = { ...p.under, shape: 'fill-mask', mask }; });
      }
      return pixels;
    }
    const rows = patterns[name] || patterns.blank;
    return Array.from({ length: size * size }, (_, i) => {
      const x = Math.floor((i % size) * 16 / size), y = Math.floor(Math.floor(i / size) * 16 / size);
      const color = C[rows[y][x]];
      return color ? piece(color) : null;
    });
  }
  function snapshot() {
    state.history.push({ size: state.size, pixels: state.pixels.map(p => p && { ...p }), image: state.image,
      cropX: cropX.value, cropY: cropY.value, pixelate: pixelate.checked });
    if (state.history.length > 50) state.history.shift();
  }
  function updateControls() {
    panel.querySelectorAll('[data-icon-destination]').forEach(b => { const active = b.dataset.iconDestination === state.destination; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-background]').forEach(b => { const active = b.dataset.iconBackground === state.photoBackground; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    const isPhoto = state.destination === 'photo';
    backgroundOptions.hidden = !isPhoto;
    outputHint.textContent = isPhoto ? 'Your square drawing sits centered on a wide photo. Uploaded images use a wide crop.' : 'Your badge stays separate from your quest photo.';
    previewLabel.textContent = isPhoto ? 'Quest photo preview' : 'Quest badge preview';
    preview.setAttribute('aria-label', isPhoto ? 'Wide quest photo preview' : 'Badge at listing size');
    preview.classList.toggle('is-photo', isPhoto);
    panel.querySelector('[data-icon-action="use"]').textContent = isPhoto ? 'Use as quest photo' : 'Use as quest badge';
    panel.querySelectorAll('[data-icon-color]').forEach(b => { const active = b.dataset.iconColor === state.color; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-tool]').forEach(b => { const active = b.dataset.iconTool === state.tool; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-shape]').forEach(b => { const active = b.dataset.iconShape === state.shape; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); const svg = b.querySelector('svg'); if (svg) svg.style.transform = `rotate(${state.rotation}deg)`; });
    panel.querySelectorAll('[data-icon-size]').forEach(b => { const active = Number(b.dataset.iconSize) === state.size; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    const maxBrushSize = Math.min(8, Math.floor(state.size / (brushStretch.checked ? 2 : 1)));
    brushSize.max = String(maxBrushSize);
    const brushCells = Math.min(Number(brushSize.value), maxBrushSize);
    brushSize.value = String(brushCells);
    const brushRows = brushCells * (brushStretch.checked ? 2 : 1);
    state.stampSize = `${brushCells}x${brushRows}`;
    brushSizeValue.textContent = `${brushCells} × ${brushRows} ${brushRows === 1 ? 'cell' : 'cells'}`;
    brushSize.setAttribute('aria-valuetext', `${brushCells} by ${brushRows} ${brushRows === 1 ? 'cell' : 'cells'}`);
    const label = document.querySelector('#iconGridSizeLabel'); if (label) label.textContent = `${state.size} × ${state.size} grid`;
    const rotation = panel.querySelector('[data-icon-action="rotate"]'); if (rotation) rotation.setAttribute('aria-label', `Rotate shape clockwise. Current rotation ${state.rotation} degrees.`);
    drawGuide();
  }
  function template(name) {
    snapshot(); state.uploadRequest++;
    state.image = null; upload.value = ''; uploadControls.hidden = true;
    state.pixels = pixelsFromTemplate(name, state.size);
    say(name === 'blank' ? 'Blank canvas ready.' : `${name[0].toUpperCase() + name.slice(1)} starter ready to customize.`);
    render();
  }
  function resize(size) {
    if (![8,16,32].includes(size) || size === state.size) return;
    snapshot();
    const old = state.size, source = state.pixels;
    state.pixels = Array.from({ length: size * size }, (_, i) => {
      const newX = i % size, newY = Math.floor(i / size), scale = old / size;
      const x = Math.floor(newX * scale), y = Math.floor(newY * scale);
      const layers = [];
      for (let p = source[y * old + x]; p; p = p.under) layers.push(p);
      let result = null;
      for (let j = layers.length - 1; j >= 0; j--) {
        const p = layers[j];
        result = { ...p, under: result, x: newX - (x - p.x) / scale, y: newY - (y - p.y) / scale, cols: p.cols / scale, rows: p.rows / scale };
      }
      return result;
    });
    state.size = size; state.cursorX = Math.min(size - 1, Math.floor(state.cursorX * size / old)); state.cursorY = Math.min(size - 1, Math.floor(state.cursorY * size / old));
    updateControls(); render();
    say(size < old && !state.image ? `Grid changed to ${size} × ${size}. Small details may simplify; Undo restores the previous grid.` : `Grid changed to ${size} × ${size}. Undo restores the previous grid.`);
  }
  // Draw one shape in normalized coordinates. Clipping below turns a multi-cell stamp
  // into independent grid cells so a later stamp or eraser can edit any part.
  function shapePath(o, shape) {
    if (shape === 'vibe-word') { drawVibeWord(o); return; }
    if (shape === 'q-reference') { drawReferenceQ(o); return; }
    o.beginPath();
    if (shape === 'circle') o.arc(.5, .5, .5, 0, Math.PI * 2);
    else if (shape === 'triangle') { o.moveTo(0, 0); o.lineTo(1, 1); o.lineTo(0, 1); o.closePath(); }
    else if (shape === 'semicircle') { o.moveTo(0, 1); o.arc(.5, 1, .5, Math.PI, 0); o.closePath(); }
    else if (shape === 'sparkle') { o.moveTo(.5, .1); o.quadraticCurveTo(.46, .46, .1, .5); o.quadraticCurveTo(.46, .54, .5, .9); o.quadraticCurveTo(.54, .54, .9, .5); o.quadraticCurveTo(.54, .46, .5, .1); o.closePath(); }
    else if (shape === 'slash') { o.moveTo(0, 0); o.lineTo(.28, 0); o.lineTo(1, .72); o.lineTo(1, 1); o.lineTo(.72, 1); o.lineTo(0, .28); o.closePath(); }
    else if (shape === 'quarter') { o.moveTo(0, 1); o.arc(0, 1, 1, -Math.PI / 2, 0); o.closePath(); }
    else if (shape === 'curved') { o.moveTo(0, 0); o.lineTo(1, 0); o.lineTo(1, 1); o.arc(0, 1, 1, 0, -Math.PI / 2, true); o.closePath(); }
    else o.rect(0, 0, 1, 1);
    o.fill();
  }
  // The Q reproduces the reference on a 16-cell grid. Its curved four-point
  // flourishes and squared strokes stay editable through the normal cell clips.
  function drawReferenceQ(o) {
    o.save(); o.scale(1 / 16, 1 / 16); o.beginPath();
    const bar = (x, y, w, h) => o.rect(x, y, w, h);
    const flare = (x, y, r) => {
      o.moveTo(x, y - r);
      o.bezierCurveTo(x, y - r * .45, x + r * .45, y, x + r, y);
      o.bezierCurveTo(x + r * .45, y, x, y + r * .45, x, y + r);
      o.bezierCurveTo(x, y + r * .45, x - r * .45, y, x - r, y);
      o.bezierCurveTo(x - r * .45, y, x, y - r * .45, x, y - r);
      o.closePath();
    };
    bar(1, 3, 14, 1); bar(1, 4, 5, 1);
    bar(1, 5, 3, 8); bar(12, 4, 3, 8);
    bar(1, 12, 12, 1); bar(9, 10, 4, 3);
    flare(9, 10, 2); flare(13, 13, 2);
    o.fill(); o.restore();
  }
  // The VIBE starter follows the sixteen-cell artwork: tall tiled strokes,
  // curved cutouts, and four-point flares. It remains one editable grid stamp.
  function drawVibeWord(o) {
    o.save(); o.scale(1 / 16, 1 / 16); o.beginPath();
    const bar = (x, y, w, h) => o.rect(x, y, w, h);
    const flare = (x, y) => {
      o.moveTo(x, y - 1);
      o.bezierCurveTo(x, y - .45, x + .45, y, x + 1, y);
      o.bezierCurveTo(x + .45, y, x, y + .45, x, y + 1);
      o.bezierCurveTo(x, y + .45, x - .45, y, x - 1, y);
      o.bezierCurveTo(x - .45, y, x, y - .45, x, y - 1);
      o.closePath();
    };
    // V is deliberately a squared, rounded U in the original artwork.
    bar(1, 2, 1, 11); bar(1, 10, 2, 3); bar(3, 3, 1, 9);
    o.moveTo(3, 3); o.bezierCurveTo(3, 2.45, 3.45, 2, 4, 2);
    o.lineTo(4, 3); o.closePath();
    o.moveTo(3, 12); o.lineTo(4, 12);
    o.bezierCurveTo(4, 12.55, 3.55, 13, 3, 13); o.closePath();
    flare(1, 2); flare(1, 13);
    // I and B share the reference's long vertical proportions.
    bar(5, 2, 1, 11); flare(6, 2); flare(5, 13);
    bar(7, 2, 1, 11); bar(7, 2, 3, 1); bar(9, 3, 1, 3);
    bar(7, 6, 2, 2); bar(9, 7, 1, 6); bar(7, 12, 3, 1);
    o.moveTo(9, 6); o.bezierCurveTo(9.55, 6, 10, 6.45, 10, 7);
    o.lineTo(9, 7); o.closePath();
    flare(10, 2); flare(7, 13);
    // E uses paired concave sweeps, meeting in points at the top of each bowl.
    bar(11, 3, 3, 1); bar(11, 7, 3, 1); bar(11, 11, 2, 2); bar(11, 12, 4, 1);
    o.moveTo(11, 3); o.bezierCurveTo(11, 2.45, 11.45, 2, 12, 2);
    o.lineTo(15, 2); o.lineTo(15, 3);
    o.bezierCurveTo(15, 3.55, 14.55, 4, 14, 4); o.lineTo(11, 4); o.closePath();
    for (const y of [4, 8]) {
      o.moveTo(11, y); o.lineTo(13, y);
      o.bezierCurveTo(13, y + 1.5, 12.3, y + 2.55, 11, y + 2.8);
      o.closePath();
      o.moveTo(13, y); o.bezierCurveTo(13, y + 1.65, 14.25, y + 3, 16, y + 3);
      o.lineTo(13, y + 3); o.closePath();
    }
    flare(15, 2); flare(15, 13);
    o.fill(); o.restore();
  }
  const maskTints = new WeakMap();
  function drawPiece(o, p, x, y, cell) {
    o.save(); o.beginPath(); o.rect(x * cell, y * cell, cell, cell); o.clip();
    if (p.shape === 'fill-mask') {
      let tints = maskTints.get(p.mask);
      if (!tints) { tints = new Map(); maskTints.set(p.mask, tints); }
      if (!tints.has(p.color)) {
        const tint = document.createElement('canvas'); tint.width = tint.height = 512;
        const tc = tint.getContext('2d'); tc.drawImage(p.mask, 0, 0);
        tc.globalCompositeOperation = 'source-in'; tc.fillStyle = p.color; tc.fillRect(0, 0, 512, 512);
        tints.set(p.color, tint);
      }
      o.drawImage(tints.get(p.color), 0, 0); o.restore(); return;
    }
    o.translate((x - p.x) * cell, (y - p.y) * cell); o.scale(p.cols * cell, p.rows * cell);
    o.translate(.5, .5); o.rotate(p.rotation * Math.PI / 180); o.translate(-.5, -.5);
    o.fillStyle = p.color; shapePath(o, p.shape); o.restore();
  }
  function compose(withSeams = true) {
    const out = document.createElement('canvas'); out.width = 512; out.height = 512;
    const o = out.getContext('2d');
    if (state.image) {
      const image = state.image, side = Math.min(image.naturalWidth, image.naturalHeight);
      const x = (image.naturalWidth - side) * Number(cropX.value) / 100;
      const y = (image.naturalHeight - side) * Number(cropY.value) / 100;
      if (pixelate.checked) {
        const small = document.createElement('canvas'); small.width = small.height = state.size;
        small.getContext('2d').drawImage(image, x, y, side, side, 0, 0, state.size, state.size);
        o.imageSmoothingEnabled = false; o.drawImage(small, 0, 0, 512, 512);
      } else o.drawImage(image, x, y, side, side, 0, 0, 512, 512);
    } else {
      const cell = 512 / state.size;
      state.pixels.forEach((p, i) => {
        const layers = [];
        for (; p; p = p.under) layers.push(p);
        for (let j = layers.length - 1; j >= 0; j--) drawPiece(o, layers[j], i % state.size, Math.floor(i / state.size), cell);
      });
      // A subtle transparent seam gives each grid piece the look of a separate
      // stamp. Clear after composing layers so nothing underneath fills the gap.
      // Uploaded photographs take the other branch and are never altered.
      const gap = Math.max(1, Math.round(cell * .025));
      for (let i = 1; withSeams && i < state.size; i++) {
        const edge = Math.round(i * cell - gap / 2);
        o.clearRect(edge, 0, gap, 512);
        o.clearRect(0, edge, 512, gap);
      }
    }
    return out;
  }
  // The editable drawing remains square. Photo output places it on a wide,
  // opaque background without stretching; an uploaded image is cropped to the
  // destination aspect ratio directly from the original image.
  function composeOutput(destination = state.destination, squareArt = null) {
    if (destination === 'badge') return compose();
    const out = document.createElement('canvas'); out.width = 1200; out.height = 675;
    const o = out.getContext('2d'); o.fillStyle = state.photoBackground; o.fillRect(0, 0, 1200, 675);
    if (state.image) {
      const image = state.image, ratio = 16 / 9;
      const width = Math.min(image.naturalWidth, image.naturalHeight * ratio), height = width / ratio;
      const x = (image.naturalWidth - width) * Number(cropX.value) / 100;
      const y = (image.naturalHeight - height) * Number(cropY.value) / 100;
      if (pixelate.checked) {
        const small = document.createElement('canvas'); small.width = state.size; small.height = Math.max(1, Math.round(state.size * 9 / 16));
        small.getContext('2d').drawImage(image, x, y, width, height, 0, 0, small.width, small.height);
        o.imageSmoothingEnabled = false; o.drawImage(small, 0, 0, 1200, 675);
      } else o.drawImage(image, x, y, width, height, 0, 0, 1200, 675);
    } else {
      o.imageSmoothingEnabled = false;
      o.drawImage(squareArt || compose(), 262, 0, 675, 675);
    }
    return out;
  }
  // The eraser clears every cell in the footprint, irrespective of the chosen
  // shape. Fill is region-based, so a stamp outline would be misleading there.
  function drawGuide() {
    guideCtx.clearRect(0, 0, 512, 512);
    if (!state.hover || state.image || state.pointer || state.tool === 'fill') return;
    const [x, y] = state.hover, cell = 512 / state.size;
    let [cols, rows] = state.stampSize.split('x').map(Number);
    if (state.rotation % 180) [cols, rows] = [rows, cols];
    const mask = guideMask.getContext('2d');
    mask.clearRect(0, 0, 512, 512); mask.fillStyle = '#22242a';
    mask.save();
    mask.translate(x * cell, y * cell); mask.scale(cols * cell, rows * cell);
    if (state.tool !== 'eraser') {
      mask.translate(.5, .5); mask.rotate(state.rotation * Math.PI / 180); mask.translate(-.5, -.5);
    }
    shapePath(mask, state.tool === 'eraser' ? 'square' : state.shape);
    mask.restore();
    const white = guideWhite.getContext('2d');
    white.clearRect(0, 0, 512, 512); white.drawImage(guideMask, 0, 0);
    white.globalCompositeOperation = 'source-in'; white.fillStyle = '#fff'; white.fillRect(0, 0, 512, 512);
    white.globalCompositeOperation = 'source-over';
    // Two contrasting outlines stay visible on light and dark colors alike.
    for (const [dx, dy] of [[-3,0],[3,0],[0,-3],[0,3],[-2,-2],[-2,2],[2,-2],[2,2]]) guideCtx.drawImage(guideMask, dx, dy);
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]) guideCtx.drawImage(guideWhite, dx, dy);
    guideCtx.globalCompositeOperation = 'destination-out'; guideCtx.drawImage(guideMask, 0, 0);
    guideCtx.globalCompositeOperation = 'source-over';
  }
  function render() {
    const art = compose(); const output = state.destination === 'photo' ? composeOutput('photo', art) : art;
    ctx.clearRect(0, 0, 512, 512);
    if (state.image && state.destination === 'photo') ctx.drawImage(output, 0, 112, 512, 288);
    else ctx.drawImage(art, 0, 0);
    if (!state.image) {
      const cell = 512 / state.size;
      if (state.keyboard) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.strokeRect(state.cursorX * cell + 2, state.cursorY * cell + 2, cell - 4, cell - 4); ctx.strokeStyle = '#22242a'; ctx.lineWidth = 1; ctx.strokeRect(state.cursorX * cell + 3, state.cursorY * cell + 3, cell - 6, cell - 6); }
    }
    const isPhoto = state.destination === 'photo';
    const width = isPhoto ? 160 : 64, height = isPhoto ? 90 : 64;
    if (preview.width !== width || preview.height !== height) { preview.width = width; preview.height = height; }
    previewCtx.clearRect(0, 0, width, height); previewCtx.imageSmoothingEnabled = !pixelate.checked && !!state.image;
    previewCtx.drawImage(output, 0, 0, width, height);
    drawGuide();
  }
  function same(a, b) { return (a?.color || null) === (b?.color || null); }
  // Bucket fill follows the actual transparent pixels, not the bounding boxes of
  // curved pieces. Keep a mask underneath existing layers so corners can fill
  // without painting over the shapes (or unrelated enclosed empty areas).
  function fillTransparent(px, py, artwork) {
    const side = 512, data = artwork.getContext('2d').getImageData(0, 0, side, side).data;
    const start = py * side + px;
    if (data[start * 4 + 3] === 255) return false;
    const visited = new Uint8Array(side * side), queue = new Int32Array(side * side);
    let head = 0, tail = 0;
    const add = n => { if (!visited[n] && data[n * 4 + 3] < 255) { visited[n] = 1; queue[tail++] = n; } };
    add(start);
    while (head < tail) {
      const n = queue[head++], x = n % side, y = Math.floor(n / side);
      if (x) add(n - 1); if (x < side - 1) add(n + 1);
      if (y) add(n - side); if (y < side - 1) add(n + side);
    }
    const mask = document.createElement('canvas'); mask.width = mask.height = side;
    const maskCtx = mask.getContext('2d'), image = maskCtx.createImageData(side, side);
    const rgb = [1, 3, 5].map(i => parseInt(state.color.slice(i, i + 2), 16));
    const touched = new Set(), cell = side / state.size;
    for (let i = 0; i < tail; i++) {
      const n = queue[i], at = n * 4;
      image.data[at] = rgb[0]; image.data[at + 1] = rgb[1]; image.data[at + 2] = rgb[2]; image.data[at + 3] = 255;
      touched.add(Math.floor(n / side / cell) * state.size + Math.floor((n % side) / cell));
    }
    maskCtx.putImageData(image, 0, 0);
    const beneath = (p, bottom) => p ? { ...p, under: beneath(p.under, bottom) } : bottom;
    touched.forEach(i => { state.pixels[i] = beneath(state.pixels[i], { ...piece(state.color, 'fill-mask'), mask }); });
    return true;
  }
  function visibleLayerAt(p, x, y, px, py) {
    const sample = document.createElement('canvas'); sample.width = sample.height = 512;
    const context = sample.getContext('2d'), cell = 512 / state.size;
    for (; p; p = p.under) {
      context.clearRect(0, 0, 512, 512); drawPiece(context, p, x, y, cell);
      if (context.getImageData(px, py, 1, 1).data[3]) return p;
    }
    return null;
  }
  function edit(x, y, px = Math.floor((x + .5) * 512 / state.size), py = Math.floor((y + .5) * 512 / state.size)) {
    if (state.image) { say('Choose a starter or Blank to draw. Your uploaded image will be replaced.'); return; }
    const size = state.size, i = y * size + x;
    if (state.tool === 'fill') {
      const artwork = compose(false);
      if (fillTransparent(px, py, artwork)) { render(); return; }
      const old = visibleLayerAt(state.pixels[i], x, y, px, py), next = piece(state.color);
      if (same(old, next)) return;
      if (old?.shape === 'fill-mask') {
        const recolor = p => !p ? p : { ...p, color: p.mask === old.mask && p.color === old.color ? state.color : p.color, under: recolor(p.under) };
        state.pixels = state.pixels.map(recolor); render(); return;
      }
      const todo = [i], seen = new Set();
      while (todo.length) { const n = todo.pop(); if (seen.has(n) || !same(state.pixels[n], old)) continue; seen.add(n); state.pixels[n] = state.pixels[n] ? { ...state.pixels[n], color: state.color } : { ...next }; const xx = n % size, yy = Math.floor(n / size); if (xx) todo.push(n - 1); if (xx < size - 1) todo.push(n + 1); if (yy) todo.push(n - size); if (yy < size - 1) todo.push(n + size); }
    } else {
      let [cols, rows] = state.stampSize.split('x').map(Number);
      if (state.rotation % 180) [cols, rows] = [rows, cols];
      for (let dy = 0; dy < rows && y + dy < size; dy++) for (let dx = 0; dx < cols && x + dx < size; dx++) {
        const index = (y + dy) * size + x + dx;
        const previous = state.pixels[index];
        if (state.tool === 'eraser') { state.pixels[index] = null; continue; }
        const sameShape = previous && previous.shape === state.shape && previous.rotation === state.rotation &&
          previous.x === dx && previous.y === dy && previous.cols === cols && previous.rows === rows;
        if (sameShape && previous.color === state.color) continue;
        // A square covers the whole cell, and an identical shape replaces its earlier
        // layer. Avoid retaining hidden layers during long brush strokes.
        const under = state.shape === 'square' ? null : (sameShape ? previous.under : previous);
        state.pixels[index] = { ...piece(state.color, state.shape, state.rotation, dx, dy, cols, rows), under };
      }
    }
    render();
  }
  function coords(e) { const r = canvas.getBoundingClientRect(), size = state.size; const px = Math.max(0, Math.min(511, Math.floor((e.clientX-r.left)/r.width*512))), py = Math.max(0, Math.min(511, Math.floor((e.clientY-r.top)/r.height*512))); return [Math.floor(px * size / 512), Math.floor(py * size / 512), px, py]; }
  function hasArt() { return !!state.image || state.pixels.some(Boolean); }
  function outputBlob(destination) { return new Promise((resolve, reject) => { if (!hasArt()) { reject(new Error('Add a little artwork first.')); return; } composeOutput(destination).toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not make your image. Please try again.')), 'image/png'); }); }
  function getBadgeBlob() { return outputBlob('badge'); }
  function getOutputBlob() { return outputBlob(state.destination); }
  function hoverAt(e) {
    if (e.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX >= r.right || e.clientY < r.top || e.clientY >= r.bottom) {
      state.hover = null; drawGuide(); return;
    }
    const [x, y] = coords(e);
    if (state.hover?.[0] === x && state.hover?.[1] === y) return;
    state.hover = [x, y]; drawGuide();
  }
  canvas.addEventListener('pointerenter', hoverAt);
  canvas.addEventListener('pointerleave', () => { state.hover = null; drawGuide(); });
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); state.keyboard = false; state.pointer = true; state.hover = null; drawGuide(); canvas.setPointerCapture(e.pointerId); if (!state.image) snapshot(); const [x,y,px,py] = coords(e); state.lastPoint = [x,y]; edit(x,y,px,py); });
  canvas.addEventListener('pointermove', e => {
    if (!state.pointer) { hoverAt(e); return; }
    if (state.tool === 'fill') return;
    const [x,y] = coords(e), [fromX,fromY] = state.lastPoint || [x,y];
    const steps = Math.max(Math.abs(x-fromX), Math.abs(y-fromY));
    for (let i = 1; i <= steps; i++) edit(Math.round(fromX+(x-fromX)*i/steps), Math.round(fromY+(y-fromY)*i/steps));
    state.lastPoint = [x,y];
  });
  canvas.addEventListener('pointerup', e => { state.pointer = false; hoverAt(e); });
  canvas.addEventListener('pointercancel', () => { state.pointer = false; state.hover = null; drawGuide(); });
  canvas.addEventListener('focus', () => { state.keyboard = true; render(); });
  canvas.addEventListener('blur', () => { state.keyboard = false; render(); });
  canvas.addEventListener('keydown', e => {
    const moves = { ArrowLeft: [-1,0], ArrowRight: [1,0], ArrowUp: [0,-1], ArrowDown: [0,1] };
    if (moves[e.key]) { e.preventDefault(); state.keyboard = true; state.cursorX = Math.max(0, Math.min(state.size - 1, state.cursorX + moves[e.key][0])); state.cursorY = Math.max(0, Math.min(state.size - 1, state.cursorY + moves[e.key][1])); canvas.setAttribute('aria-label', `Pixel editor, column ${state.cursorX+1}, row ${state.cursorY+1}. Press space to apply ${state.tool}.`); render(); }
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!state.image) snapshot(); edit(state.cursorX, state.cursorY); }
  });
  function undo() {
    const previous = state.history.pop();
    if (previous) { state.uploadRequest++; state.size = previous.size; state.pixels = previous.pixels; state.image = previous.image; cropX.value = previous.cropX; cropY.value = previous.cropY; pixelate.checked = previous.pixelate; uploadControls.hidden = !state.image; if (!state.image) upload.value = ''; state.cursorX = Math.min(state.cursorX, state.size - 1); state.cursorY = Math.min(state.cursorY, state.size - 1); render(); say('Last change undone.'); }
    else say('Nothing to undo yet.');
    updateControls();
  }
  document.addEventListener('keydown', e => {
    // Leave typing undo and shortcuts outside the visible studio to the browser.
    const target = e.target;
    const textInput = target instanceof HTMLInputElement &&
      !['range', 'checkbox', 'radio', 'color', 'button', 'submit', 'reset', 'file', 'image'].includes(target.type);
    if (e.defaultPrevented || e.isComposing || e.repeat || e.altKey || e.shiftKey ||
        !(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z' || !panel.getClientRects().length ||
        textInput || (target instanceof Element && (target.closest('textarea, select') || target.isContentEditable))) return;
    e.preventDefault();
    undo();
  });
  panel.addEventListener('click', async e => {
    const target = e.target.closest('[data-icon-template], [data-icon-color], [data-icon-tool], [data-icon-shape], [data-icon-size], [data-icon-action], [data-icon-destination], [data-icon-background]'); if (!target) return;
    if (target.dataset.iconTemplate) { template(target.dataset.iconTemplate); return; }
    if (target.dataset.iconDestination) { state.destination = target.dataset.iconDestination === 'photo' ? 'photo' : 'badge'; updateControls(); render(); return; }
    if (target.dataset.iconBackground) { state.photoBackground = target.dataset.iconBackground; updateControls(); render(); return; }
    if (target.dataset.iconColor) { state.color = target.dataset.iconColor; custom.value = state.color; }
    if (target.dataset.iconTool) state.tool = target.dataset.iconTool;
    if (target.dataset.iconShape && shapes.includes(target.dataset.iconShape)) { state.shape = target.dataset.iconShape; state.tool = 'pencil'; }
    if (target.dataset.iconSize) { resize(Number(target.dataset.iconSize)); return; }
    if (target.dataset.iconAction === 'rotate') { state.rotation = (state.rotation + 90) % 360; say(`Shape rotated to ${state.rotation} degrees.`); }
    if (target.dataset.iconAction === 'undo') { undo(); return; }
    if (target.dataset.iconAction === 'download' || target.dataset.iconAction === 'use') {
      try { const destination = state.destination; const blob = await outputBlob(destination); if (target.dataset.iconAction === 'use') { window.dispatchEvent(new CustomEvent('vibe-icon-selected', {detail: {blob, destination}})); say(`Opening the quest form with your ${destination === 'photo' ? 'photo' : 'badge'}.`); } else { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `vibe-quest-${destination}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); say(`Your ${destination === 'photo' ? 'photo' : 'badge'} is ready to download.`); } } catch (err) { say(err.message); }
    }
    updateControls();
  });
  custom.addEventListener('input', () => { state.color = custom.value; updateControls(); });
  [brushSize, brushStretch].forEach(el => el.addEventListener('input', updateControls));
  upload.addEventListener('change', () => {
    const file = upload.files?.[0]; if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { say('Choose a PNG, JPG, or WebP image under 5 MB.'); upload.value = ''; return; }
    const request = ++state.uploadRequest, url = URL.createObjectURL(file), image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); if (request !== state.uploadRequest) return; snapshot(); state.image = image; uploadControls.hidden = false; cropX.value = cropY.value = 50; pixelate.checked = false; say('Image loaded. Adjust the crop or add a pixel effect.'); render(); };
    image.onerror = () => { URL.revokeObjectURL(url); if (request !== state.uploadRequest) return; upload.value = ''; say('Could not open that image. Please try another.'); };
    image.src = url;
  });
  [cropX, cropY, pixelate].forEach(el => el.addEventListener('input', render));
  state.pixels = pixelsFromTemplate('spark', state.size);
  window.vvIconStudio = { render, getBadgeBlob, getOutputBlob, open(destination) {
    if (destination === 'photo' || destination === 'badge') state.destination = destination;
    updateControls(); render(); window.vvVibetineraryStudio?.setWorkshopMode('icon');
  } };
  updateControls(); render();
})();
