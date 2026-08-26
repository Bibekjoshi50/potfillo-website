// ================= LIGHTBOX (GALLERY PHOTOS + CERTIFICATES) =================
// Click any gallery photo — or any certificate — to view it full-size with
// next/prev navigation, captions, keyboard and swipe support. Each group
// (gallery, certificates) is paged through independently.

(function () {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay) return;

  const imageEl = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const tagEl = document.getElementById('lightboxTag');
  const counterEl = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  // Each "collection" is one independent list you can page through.
  const collections = [];

  // 1) Event gallery ----------------------------------------------------------
  const galleryCards = Array.from(
    document.querySelectorAll('#galleryContainer .gallery-card')
  );
  if (galleryCards.length) {
    collections.push({
      cards: galleryCards,
      read(card) {
        const img = card.querySelector('img');
        return {
          src: img.src,
          alt: img.alt,
          title: card.dataset.title || img.alt || '',
          tag: card.dataset.tag || ''
        };
      }
    });
  }

  // 2) Certificates ------------------------------------------------------------
  // The certificate cards are plain <div>s in the markup, so upgrade them into
  // accessible, zoomable buttons here (adds the magnifier icon + keyboard use).
  const certCards = Array.from(
    document.querySelectorAll('.certificate-container .certificate-card')
  );
  if (certCards.length) {
    certCards.forEach(card => {
      if (!card.querySelector('.gallery-zoom')) {
        const zoom = document.createElement('span');
        zoom.className = 'gallery-zoom';
        zoom.setAttribute('aria-hidden', 'true');
        zoom.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';
        card.insertBefore(zoom, card.firstChild);
      }
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const heading = card.querySelector('h4');
      if (heading) {
        card.setAttribute('aria-label', 'View certificate: ' + heading.textContent.trim());
      }
    });
    collections.push({
      cards: certCards,
      read(card) {
        const img = card.querySelector('img');
        const heading = card.querySelector('h4');
        const type = card.querySelector('p');
        return {
          src: img.src,
          alt: img.alt,
          title: heading ? heading.textContent.trim() : (img.alt || ''),
          tag: type ? type.textContent.trim() : ''
        };
      }
    });
  }

  if (!collections.length) return;

  let active = collections[0];
  let currentIndex = 0;

  function updateLightbox() {
    const data = active.read(active.cards[currentIndex]);
    imageEl.src = data.src;
    imageEl.alt = data.alt;
    titleEl.textContent = data.title;
    tagEl.textContent = data.tag;
    counterEl.textContent = (currentIndex + 1) + ' / ' + active.cards.length;
  }

  function openLightbox(collection, index) {
    active = collection;
    currentIndex = index;
    updateLightbox();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % active.cards.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + active.cards.length) % active.cards.length;
    updateLightbox();
  }

  collections.forEach(collection => {
    collection.cards.forEach((card, index) => {
      card.addEventListener('click', () => openLightbox(collection, index));

      // Native <button> cards already fire click on Enter/Space; only the
      // upgraded <div> cards (certificates) need explicit key handling.
      if (card.tagName !== 'BUTTON') {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(collection, index);
          }
        });
      }
    });
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
    const diff = e.changedTouches[0].screenX - touchStartX;

    if (Math.abs(diff) > 50) {
      if (diff < 0) showNext();
      else showPrev();
    }
  }, { passive: true });
})();
