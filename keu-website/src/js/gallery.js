/* =========================================================
   Karwan-e-Usmania — Gallery lightbox
   Click a tile to open a full-screen view. Esc / click backdrop closes.
   ========================================================= */

export function initGallery() {
  const grid = document.getElementById('gallery-grid')
  if (!grid) return

  let lightbox = null

  const ensureLightbox = () => {
    if (lightbox) return lightbox
    lightbox = document.createElement('div')
    lightbox.className = 'modal-overlay'
    lightbox.innerHTML = `
      <div class="modal" style="max-width:min(960px,95vw);padding:0;background:transparent;box-shadow:none">
        <button class="modal__close" type="button" aria-label="Close" style="background:rgba(255,255,255,0.08);color:white;width:44px;height:44px">×</button>
        <img alt="" style="width:100%;height:auto;border-radius:var(--radius-lg);box-shadow:var(--shadow-xl)">
        <p class="lightbox-cap" style="text-align:center;color:white;margin-top:var(--space-4);font-size:var(--text-sm)"></p>
      </div>
    `
    document.body.appendChild(lightbox)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('modal__close')) close()
    })
    return lightbox
  }

  const open = (src, alt) => {
    const lb = ensureLightbox()
    const img = lb.querySelector('img')
    img.src = src
    img.alt = alt
    lb.querySelector('.lightbox-cap').textContent = alt
    lb.dataset.open = 'true'
    document.body.classList.add('no-scroll')
  }
  const close = () => {
    if (!lightbox) return
    lightbox.dataset.open = 'false'
    document.body.classList.remove('no-scroll')
  }

  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-lightbox]')
    if (!tile) return
    const img = tile.querySelector('img')
    if (img && img.src) open(img.src, img.alt)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}
