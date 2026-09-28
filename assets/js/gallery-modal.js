// Simple modal for full-size images from thumbnails
(function(){
  function createDialog(){
    const dlg = document.createElement('dialog');
    dlg.className = 'img-dialog';
    dlg.innerHTML = '<div class="panel"><div class="inner"><div class="controls"><button class="zoom-in" title="Zoom in">＋</button><button class="zoom-out" title="Zoom out">－</button><button class="close" aria-label="Close">✕</button></div><img alt=""></div></div>';
    document.body.appendChild(dlg);
    return dlg;
  }
  const modal = createDialog();
  const img = modal.querySelector('img');
  const btnClose = modal.querySelector('.close');
  const btnIn = modal.querySelector('.zoom-in');
  const btnOut = modal.querySelector('.zoom-out');

  let scale = 1, tx = 0, ty = 0;

  function apply(){
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function resetZoom(){ scale = 1; tx = 0; ty = 0; apply(); }

  function open(src, alt){
    img.src = src;
    img.alt = alt || '';
    resetZoom();
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open','');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
    img.src = '';
    document.body.style.overflow = '';
  }
  btnClose.addEventListener('click', close);
  modal.addEventListener('click', function(e){
    // Click outside inner closes
    const inner = modal.querySelector('.inner');
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const x = e.clientX, y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) close();
  });
  window.addEventListener('keydown', function(e){
    const isOpen = modal.hasAttribute('open');
    if (e.key === 'Escape' && isOpen) close();
    if (!isOpen) return;
    if (e.key === '+' || e.key === '=') { scale = Math.min(5, scale + 0.25); apply(); }
    if (e.key === '-' || e.key === '_') { scale = Math.max(1, scale - 0.25); if (scale===1){tx=0;ty=0;} apply(); }
  });

  btnIn.addEventListener('click', function(){ scale = Math.min(5, scale + 0.25); apply(); });
  btnOut.addEventListener('click', function(){ scale = Math.max(1, scale - 0.25); if (scale===1){tx=0;ty=0;} apply(); });

  // Drag to pan when zoomed
  let dragging = false, sx=0, sy=0;
  img.addEventListener('mousedown', function(e){
    if (scale <= 1) return;
    dragging = true; sx = e.clientX; sy = e.clientY; img.classList.add('dragging'); e.preventDefault();
  });
  window.addEventListener('mousemove', function(e){
    if (!dragging) return;
    const dx = e.clientX - sx; const dy = e.clientY - sy; sx = e.clientX; sy = e.clientY;
    tx += dx; ty += dy; apply();
  });
  window.addEventListener('mouseup', function(){ if (dragging){ dragging=false; img.classList.remove('dragging'); } });

  // Wheel zoom
  img.addEventListener('wheel', function(e){
    if (!modal.hasAttribute('open')) return;
    const rect = img.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const delta = Math.sign(e.deltaY);
    const prev = scale;
    const next = delta < 0 ? Math.min(5, scale + 0.25) : Math.max(1, scale - 0.25);
    if (next !== prev) {
      // Zoom towards the cursor
      const k = next / prev;
      tx -= (cx - rect.width / 2) * (k - 1);
      ty -= (cy - rect.height / 2) * (k - 1);
      scale = next;
      if (scale === 1) { tx = 0; ty = 0; }
      e.preventDefault();
    }
    apply();
  }, { passive: false });

  // Double click to toggle zoom
  img.addEventListener('dblclick', function(){
    if (scale === 1) scale = 2.5; else { scale = 1; tx = 0; ty = 0; }
    apply();
  });

  document.addEventListener('click', function(e){
    const a = e.target.closest && e.target.closest('a.full');
    if (!a) return;
    const full = a.getAttribute('href');
    const imgEl = a.querySelector('img');
    const alt = imgEl ? imgEl.getAttribute('alt') : (a.getAttribute('aria-label') || '');
    if (!full) return;
    e.preventDefault();
    open(full, alt);
  }, true);
})();
