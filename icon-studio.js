(() => {
  "use strict";
  const panel = document.querySelector('[data-workshop-panel="icon"]');
  const canvas = document.querySelector('#iconCanvas');
  const preview = document.querySelector('#iconSmallPreview');
  if (!panel || !canvas || !preview) return;
  const ctx = canvas.getContext('2d');
  const previewCtx = preview.getContext('2d');
  const status = document.querySelector('#iconStatus');
  const upload = document.querySelector('#iconUpload');
  const uploadControls = document.querySelector('#iconUploadControls');
  const cropX = document.querySelector('#iconCropX');
  const cropY = document.querySelector('#iconCropY');
  const pixelate = document.querySelector('#iconPixelate');
  const custom = document.querySelector('#iconCustomColor');
  const C = { o: '#fa622e', y: '#f8d23d', c: '#f3e9c4', t: '#0f8fb1', d: '#2f3035', p: '#f45077' };
  const patterns = {
    spark: ['................','.......yy.......','.......yy.......','......yyyy......','......yyyy......','.....yyyyyy.....','..yyyyyyyyyyyy..','..yyyyyyyyyyyy..','.....yyyyyy.....','......yyyy......','......yyyy......','.......yy.......','.......yy.......','................','................','................'],
    mushroom: ['................','.....oooooo.....','...oooooooooo...','..oooccoooccoo..','.ooooccoooccooo.','.oooooooooooooo.','.oooccooooocooo.','.oooccooooocooo.','..oooooooooooo..','....cccccccc....','.....cccccc.....','.....ccddcc.....','.....cccccc.....','....cccccccc....','................','................'],
    tent: ['................','.......yy.......','.......yy.......','......ytty......','......yttty.....','.....yttttty....','.....yttttty....','....yttttttty...','....yttttttty...','...ytttdttttty..','...yttdddtttty..','..yttdddddtttty.','.yyyyyyyyyyyyyy.','................','................','................'],
    heart: ['................','................','...pppp..pppp...','..pppppppppppp..','.pppppppppppppp.','.pppppppppppppp.','.pppppppppppppp.','..pppppppppppp..','...pppppppppp...','....pppppppp....','.....pppppp.....','......pppp......','.......pp.......','................','................','................'],
    blank: Array(16).fill('................')
  };
  const state = { size: 16, pixels: [], color: C.o, shape: 'square', rotation: 0, stampSize: '1x1', tool: 'pencil', history: [], image: null, pointer: false, lastPoint: null, cursorX: 7, cursorY: 7, keyboard: false, uploadRequest: 0 };
  const shapes = ['square', 'triangle', 'circle', 'semicircle', 'quarter', 'curved'];
  function say(text) { status.textContent = text; }
  function piece(color, shape = 'square', rotation = 0, x = 0, y = 0, cols = 1, rows = 1) { return { color, shape, rotation, x, y, cols, rows }; }
  function pixelsFromTemplate(name, size) {
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
    panel.querySelectorAll('[data-icon-color]').forEach(b => { const active = b.dataset.iconColor === state.color; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-tool]').forEach(b => { const active = b.dataset.iconTool === state.tool; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-shape]').forEach(b => { const active = b.dataset.iconShape === state.shape; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); const svg = b.querySelector('svg'); if (svg) svg.style.transform = `rotate(${state.rotation}deg)`; });
    panel.querySelectorAll('[data-icon-size]').forEach(b => { const active = Number(b.dataset.iconSize) === state.size; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-stamp-size]').forEach(b => { const active = b.dataset.iconStampSize === state.stampSize; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    const label = document.querySelector('#iconGridSizeLabel'); if (label) label.textContent = `${state.size} × ${state.size} grid`;
    const rotation = panel.querySelector('[data-icon-action="rotate"]'); if (rotation) rotation.setAttribute('aria-label', `Rotate shape clockwise. Current rotation ${state.rotation} degrees.`);
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
      const p = source[y * old + x];
      return p && { ...p, x: newX - (x - p.x) / scale, y: newY - (y - p.y) / scale, cols: p.cols / scale, rows: p.rows / scale };
    });
    state.size = size; state.cursorX = Math.min(size - 1, Math.floor(state.cursorX * size / old)); state.cursorY = Math.min(size - 1, Math.floor(state.cursorY * size / old));
    updateControls(); render();
    say(size < old && !state.image ? `Grid changed to ${size} × ${size}. Small details may simplify; Undo restores the previous grid.` : `Grid changed to ${size} × ${size}. Undo restores the previous grid.`);
  }
  // Draw one shape in normalized coordinates. Clipping below turns a multi-cell stamp
  // into independent grid cells so a later stamp or eraser can edit any part.
  function shapePath(o, shape) {
    o.beginPath();
    if (shape === 'circle') o.arc(.5, .5, .5, 0, Math.PI * 2);
    else if (shape === 'triangle') { o.moveTo(0, 0); o.lineTo(1, 1); o.lineTo(0, 1); o.closePath(); }
    else if (shape === 'semicircle') { o.moveTo(0, 1); o.arc(.5, 1, .5, Math.PI, 0); o.closePath(); }
    else if (shape === 'quarter') { o.moveTo(0, 1); o.arc(0, 1, 1, -Math.PI / 2, 0); o.closePath(); }
    else if (shape === 'curved') { o.moveTo(0, 0); o.lineTo(1, 0); o.lineTo(1, 1); o.arc(0, 1, 1, 0, -Math.PI / 2, true); o.closePath(); }
    else o.rect(0, 0, 1, 1);
    o.fill();
  }
  function drawPiece(o, p, x, y, cell) {
    o.save(); o.beginPath(); o.rect(x * cell, y * cell, cell, cell); o.clip();
    o.translate((x - p.x) * cell, (y - p.y) * cell); o.scale(p.cols * cell, p.rows * cell);
    o.translate(.5, .5); o.rotate(p.rotation * Math.PI / 180); o.translate(-.5, -.5);
    o.fillStyle = p.color; shapePath(o, p.shape); o.restore();
  }
  function compose() {
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
      state.pixels.forEach((p, i) => { if (p) drawPiece(o, p, i % state.size, Math.floor(i / state.size), cell); });
    }
    return out;
  }
  function render() {
    const art = compose(); ctx.clearRect(0, 0, 512, 512); ctx.drawImage(art, 0, 0);
    if (!state.image) {
      const cell = 512 / state.size;
      if (state.keyboard) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.strokeRect(state.cursorX * cell + 2, state.cursorY * cell + 2, cell - 4, cell - 4); ctx.strokeStyle = '#22242a'; ctx.lineWidth = 1; ctx.strokeRect(state.cursorX * cell + 3, state.cursorY * cell + 3, cell - 6, cell - 6); }
    }
    previewCtx.clearRect(0, 0, 64, 64); previewCtx.imageSmoothingEnabled = !pixelate.checked && !!state.image; previewCtx.drawImage(art, 0, 0, 64, 64);
  }
  function same(a, b) { return (a?.color || null) === (b?.color || null); }
  function edit(x, y) {
    if (state.image) { say('Choose a starter or Blank to draw. Your uploaded image will be replaced.'); return; }
    const size = state.size, i = y * size + x;
    if (state.tool === 'fill') {
      const old = state.pixels[i], next = piece(state.color);
      if (same(old, next)) return;
      const todo = [i], seen = new Set();
      while (todo.length) { const n = todo.pop(); if (seen.has(n) || !same(state.pixels[n], old)) continue; seen.add(n); state.pixels[n] = state.pixels[n] ? { ...state.pixels[n], color: state.color } : { ...next }; const xx = n % size, yy = Math.floor(n / size); if (xx) todo.push(n - 1); if (xx < size - 1) todo.push(n + 1); if (yy) todo.push(n - size); if (yy < size - 1) todo.push(n + size); }
    } else {
      let [cols, rows] = state.stampSize.split('x').map(Number);
      if (state.rotation % 180) [cols, rows] = [rows, cols];
      for (let dy = 0; dy < rows && y + dy < size; dy++) for (let dx = 0; dx < cols && x + dx < size; dx++) {
        state.pixels[(y + dy) * size + x + dx] = state.tool === 'eraser' ? null : piece(state.color, state.shape, state.rotation, dx, dy, cols, rows);
      }
    }
    render();
  }
  function coords(e) { const r = canvas.getBoundingClientRect(), size = state.size; return [Math.max(0, Math.min(size - 1, Math.floor((e.clientX-r.left)/r.width*size))), Math.max(0, Math.min(size - 1, Math.floor((e.clientY-r.top)/r.height*size)))]; }
  function hasArt() { return !!state.image || state.pixels.some(Boolean); }
  function getBadgeBlob() { return new Promise((resolve, reject) => { if (!hasArt()) { reject(new Error('Add a little artwork first.')); return; } compose().toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not make your badge. Please try again.')), 'image/png'); }); }
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); state.keyboard = false; state.pointer = true; canvas.setPointerCapture(e.pointerId); if (!state.image) snapshot(); const [x,y] = coords(e); state.lastPoint = [x,y]; edit(x,y); });
  canvas.addEventListener('pointermove', e => {
    if (!state.pointer || state.tool === 'fill') return;
    const [x,y] = coords(e), [fromX,fromY] = state.lastPoint || [x,y];
    const steps = Math.max(Math.abs(x-fromX), Math.abs(y-fromY));
    for (let i = 1; i <= steps; i++) edit(Math.round(fromX+(x-fromX)*i/steps), Math.round(fromY+(y-fromY)*i/steps));
    state.lastPoint = [x,y];
  });
  canvas.addEventListener('pointerup', () => { state.pointer = false; });
  canvas.addEventListener('pointercancel', () => { state.pointer = false; });
  canvas.addEventListener('focus', () => { state.keyboard = true; render(); });
  canvas.addEventListener('blur', () => { state.keyboard = false; render(); });
  canvas.addEventListener('keydown', e => {
    const moves = { ArrowLeft: [-1,0], ArrowRight: [1,0], ArrowUp: [0,-1], ArrowDown: [0,1] };
    if (moves[e.key]) { e.preventDefault(); state.keyboard = true; state.cursorX = Math.max(0, Math.min(state.size - 1, state.cursorX + moves[e.key][0])); state.cursorY = Math.max(0, Math.min(state.size - 1, state.cursorY + moves[e.key][1])); canvas.setAttribute('aria-label', `Pixel editor, column ${state.cursorX+1}, row ${state.cursorY+1}. Press space to apply ${state.tool}.`); render(); }
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!state.image) snapshot(); edit(state.cursorX, state.cursorY); }
  });
  panel.addEventListener('click', async e => {
    const target = e.target.closest('[data-icon-template], [data-icon-color], [data-icon-tool], [data-icon-shape], [data-icon-size], [data-icon-stamp-size], [data-icon-action]'); if (!target) return;
    if (target.dataset.iconTemplate) { template(target.dataset.iconTemplate); return; }
    if (target.dataset.iconColor) { state.color = target.dataset.iconColor; custom.value = state.color; }
    if (target.dataset.iconTool) state.tool = target.dataset.iconTool;
    if (target.dataset.iconShape && shapes.includes(target.dataset.iconShape)) { state.shape = target.dataset.iconShape; state.tool = 'pencil'; }
    if (target.dataset.iconStampSize && ['1x1','2x2','1x2'].includes(target.dataset.iconStampSize)) state.stampSize = target.dataset.iconStampSize;
    if (target.dataset.iconSize) { resize(Number(target.dataset.iconSize)); return; }
    if (target.dataset.iconAction === 'rotate') { state.rotation = (state.rotation + 90) % 360; say(`Shape rotated to ${state.rotation} degrees.`); }
    if (target.dataset.iconAction === 'undo') {
      const previous = state.history.pop();
      if (previous) { state.uploadRequest++; state.size = previous.size; state.pixels = previous.pixels; state.image = previous.image; cropX.value = previous.cropX; cropY.value = previous.cropY; pixelate.checked = previous.pixelate; uploadControls.hidden = !state.image; if (!state.image) upload.value = ''; state.cursorX = Math.min(state.cursorX, state.size - 1); state.cursorY = Math.min(state.cursorY, state.size - 1); render(); say('Last change undone.'); }
      else say('Nothing to undo yet.');
    }
    if (target.dataset.iconAction === 'download' || target.dataset.iconAction === 'use') {
      try { const blob = await getBadgeBlob(); if (target.dataset.iconAction === 'use') { window.dispatchEvent(new CustomEvent('vibe-icon-selected', {detail: {blob}})); say('Opening the quest form with your badge.'); } else { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'vibe-quest-badge.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); say('Your badge is ready to download.'); } } catch (err) { say(err.message); }
    }
    updateControls();
  });
  custom.addEventListener('input', () => { state.color = custom.value; updateControls(); });
  upload.addEventListener('change', () => {
    const file = upload.files?.[0]; if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { say('Choose a PNG, JPG, or WebP image under 5 MB.'); upload.value = ''; return; }
    const request = ++state.uploadRequest, url = URL.createObjectURL(file), image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); if (request !== state.uploadRequest) return; snapshot(); state.image = image; uploadControls.hidden = false; cropX.value = cropY.value = 50; pixelate.checked = false; say('Image loaded. Adjust the square crop or add a pixel effect.'); render(); };
    image.onerror = () => { URL.revokeObjectURL(url); if (request !== state.uploadRequest) return; upload.value = ''; say('Could not open that image. Please try another.'); };
    image.src = url;
  });
  [cropX, cropY, pixelate].forEach(el => el.addEventListener('input', render));
  state.pixels = pixelsFromTemplate('spark', state.size);
  window.vvIconStudio = { render, getBadgeBlob, open() { window.vvVibetineraryStudio?.setWorkshopMode('icon'); } };
  updateControls(); render();
})();
