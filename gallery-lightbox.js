// ================= GALLERY LIGHTBOX =================
// Click any gallery photo to view it full-size with next/prev
// navigation, captions, and keyboard support.

(function () {
  const cards = Array.from(document.querySelectorAll('#galleryContainer .gallery-card'));
  const overlay = document.getElementById('lightboxOverlay');

  if (!cards.length || !overlay) return;

  const imageEl = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const tagEl = document.getElementById('lightboxTag');
  const counterEl = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const card = cards[currentIndex];
    const img = card.querySelector('img');

    imageEl.src = img.src;
    imageEl.alt = img.alt;
    titleEl.textContent = card.dataset.title || img.alt;
    tagEl.textContent = card.dataset.tag || '';
    counterEl.textContent = (currentIndex + 1) + ' / ' + cards.length;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateLightbox();
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Close when clicking the dark backdrop (not the image/content itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Basic swipe support for mobile
  let touchStartX = 0;

  overlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > 50) {
      if (diff < 0) showNext();
      else showPrev();
    }
  }, { passive: true });
})();
