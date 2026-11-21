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
  const S = 16;
  const C = { o: '#fa622e', y: '#f8d23d', c: '#f3e9c4', t: '#0f8fb1', d: '#2f3035', p: '#f45077' };
  const patterns = {
    spark: ['................','.......yy.......','.......yy.......','......yyyy......','......yyyy......','.....yyyyyy.....','..yyyyyyyyyyyy..','..yyyyyyyyyyyy..','.....yyyyyy.....','......yyyy......','......yyyy......','.......yy.......','.......yy.......','................','................','................'],
    mushroom: ['................','.....oooooo.....','...oooooooooo...','..oooccoooccoo..','.ooooccoooccooo.','.oooooooooooooo.','.oooccooooocooo.','.oooccooooocooo.','..oooooooooooo..','....cccccccc....','.....cccccc.....','.....ccddcc.....','.....cccccc.....','....cccccccc....','................','................'],
    tent: ['................','.......yy.......','.......yy.......','......ytty......','......yttty.....','.....yttttty....','.....yttttty....','....yttttttty...','....yttttttty...','...ytttdttttty..','...yttdddtttty..','..yttdddddtttty.','.yyyyyyyyyyyyyy.','................','................','................'],
    heart: ['................','................','...pppp..pppp...','..pppppppppppp..','.pppppppppppppp.','.pppppppppppppp.','.pppppppppppppp.','..pppppppppppp..','...pppppppppp...','....pppppppp....','.....pppppp.....','......pppp......','.......pp.......','................','................','................'],
    blank: Array(16).fill('................')
  };
  const state = { pixels: [], color: C.o, tool: 'pencil', history: [], image: null, pointer: false, lastPoint: null, cursorX: 7, cursorY: 7, keyboard: false };
  function say(text) { status.textContent = text; }
  function snapshot() { state.history.push(state.pixels.slice()); if (state.history.length > 30) state.history.shift(); }
  function template(name) {
    snapshot();
    state.image = null;
    upload.value = '';
    uploadControls.hidden = true;
    state.pixels = (patterns[name] || patterns.blank).join('').split('').map(c => C[c] || null);
    say(name === 'blank' ? 'Blank canvas ready.' : `${name[0].toUpperCase() + name.slice(1)} starter ready to customize.`);
    render();
  }
  function compose() {
    const out = document.createElement('canvas'); out.width = 512; out.height = 512;
    const o = out.getContext('2d');
    if (state.image) {
      const image = state.image;
      const side = Math.min(image.naturalWidth, image.naturalHeight);
      const x = (image.naturalWidth - side) * Number(cropX.value) / 100;
      const y = (image.naturalHeight - side) * Number(cropY.value) / 100;
      if (pixelate.checked) {
        const small = document.createElement('canvas'); small.width = small.height = 32;
        small.getContext('2d').drawImage(image, x, y, side, side, 0, 0, 32, 32);
        o.imageSmoothingEnabled = false; o.drawImage(small, 0, 0, 512, 512);
      } else o.drawImage(image, x, y, side, side, 0, 0, 512, 512);
    } else {
      state.pixels.forEach((color, i) => { if (color) { o.fillStyle = color; o.fillRect((i % S) * 32, Math.floor(i / S) * 32, 32, 32); } });
    }
    return out;
  }
  function render() {
    const art = compose();
    ctx.clearRect(0, 0, 512, 512); ctx.drawImage(art, 0, 0);
    if (!state.image) {
      ctx.strokeStyle = 'rgba(47,48,53,.18)'; ctx.lineWidth = 1;
      for (let i = 0; i <= S; i++) { const n = i * 32 + .5; ctx.beginPath(); ctx.moveTo(n, 0); ctx.lineTo(n, 512); ctx.moveTo(0, n); ctx.lineTo(512, n); ctx.stroke(); }
      if (state.keyboard) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.strokeRect(state.cursorX * 32 + 2, state.cursorY * 32 + 2, 28, 28); ctx.strokeStyle = '#22242a'; ctx.lineWidth = 1; ctx.strokeRect(state.cursorX * 32 + 3, state.cursorY * 32 + 3, 26, 26); }
    }
    previewCtx.clearRect(0, 0, 64, 64); previewCtx.imageSmoothingEnabled = !pixelate.checked && !!state.image; previewCtx.drawImage(art, 0, 0, 64, 64);
  }
  function edit(x, y) {
    if (state.image) { say('Choose a starter or Blank to draw. Your uploaded image will be replaced.'); return; }
    const i = y * S + x, old = state.pixels[i], next = state.tool === 'eraser' ? null : state.color;
    if (old === next) return;
    if (state.tool === 'fill') {
      const todo = [i], seen = new Set();
      while (todo.length) { const n = todo.pop(); if (seen.has(n) || state.pixels[n] !== old) continue; seen.add(n); state.pixels[n] = next; const xx = n % S, yy = Math.floor(n / S); if (xx) todo.push(n - 1); if (xx < 15) todo.push(n + 1); if (yy) todo.push(n - 16); if (yy < 15) todo.push(n + 16); }
    } else state.pixels[i] = next;
    render();
  }
  function coords(e) { const r = canvas.getBoundingClientRect(); return [Math.max(0, Math.min(15, Math.floor((e.clientX-r.left)/r.width*S))), Math.max(0, Math.min(15, Math.floor((e.clientY-r.top)/r.height*S)))]; }
  function hasArt() { return !!state.image || state.pixels.some(Boolean); }
  function getBadgeBlob() { return new Promise((resolve, reject) => { if (!hasArt()) { reject(new Error('Add a little artwork first.')); return; } compose().toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not make your badge. Please try again.')), 'image/png'); }); }
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); state.keyboard = false; state.pointer = true; canvas.setPointerCapture(e.pointerId); snapshot(); const [x,y] = coords(e); state.lastPoint = [x,y]; edit(x,y); });
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
    if (moves[e.key]) { e.preventDefault(); state.keyboard = true; state.cursorX = Math.max(0, Math.min(15, state.cursorX + moves[e.key][0])); state.cursorY = Math.max(0, Math.min(15, state.cursorY + moves[e.key][1])); canvas.setAttribute('aria-label', `Pixel editor, column ${state.cursorX+1}, row ${state.cursorY+1}. Press space to apply ${state.tool}.`); render(); }
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); snapshot(); edit(state.cursorX, state.cursorY); }
  });
  panel.addEventListener('click', async e => {
    const target = e.target.closest('[data-icon-template], [data-icon-color], [data-icon-tool], [data-icon-action]'); if (!target) return;
    if (target.dataset.iconTemplate) { template(target.dataset.iconTemplate); return; }
    if (target.dataset.iconColor) { state.color = target.dataset.iconColor; state.tool = 'pencil'; custom.value = state.color; }
    if (target.dataset.iconTool) state.tool = target.dataset.iconTool;
    if (target.dataset.iconAction === 'undo') { if (state.image) { say('Choose a starter or Blank to return to drawing.'); return; } if (state.history.length) { state.pixels = state.history.pop(); render(); say('Last change undone.'); } else say('Nothing to undo yet.'); }
    if (target.dataset.iconAction === 'download' || target.dataset.iconAction === 'use') {
      try { const blob = await getBadgeBlob(); if (target.dataset.iconAction === 'use') { window.dispatchEvent(new CustomEvent('vibe-icon-selected', {detail: {blob}})); say('Opening the quest form with your badge.'); } else { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'vibe-quest-badge.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); say('Your badge is ready to download.'); } } catch (err) { say(err.message); }
    }
    panel.querySelectorAll('[data-icon-color]').forEach(b => { const active = b.dataset.iconColor === state.color; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
    panel.querySelectorAll('[data-icon-tool]').forEach(b => { const active = b.dataset.iconTool === state.tool; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
  });
  custom.addEventListener('input', () => { state.color = custom.value; state.tool = 'pencil'; panel.querySelectorAll('[data-icon-color]').forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); }); panel.querySelectorAll('[data-icon-tool]').forEach(b => { const active = b.dataset.iconTool === state.tool; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); }); });
  upload.addEventListener('change', () => {
    const file = upload.files?.[0]; if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { say('Choose a PNG, JPG, or WebP image under 5 MB.'); upload.value = ''; return; }
    const url = URL.createObjectURL(file), image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); state.image = image; uploadControls.hidden = false; cropX.value = cropY.value = 50; pixelate.checked = false; say('Image loaded. Adjust the square crop or add a pixel effect.'); render(); };
    image.onerror = () => { URL.revokeObjectURL(url); upload.value = ''; say('Could not open that image. Please try another.'); };
    image.src = url;
  });
  [cropX, cropY, pixelate].forEach(el => el.addEventListener('input', render));
  state.pixels = patterns.spark.join('').split('').map(c => C[c] || null);
  window.vvIconStudio = { render, getBadgeBlob, open() { window.vvVibetineraryStudio?.setWorkshopMode('icon'); } };
  render();
})();
