// ================= FOOTER: AUTO-UPDATE COPYRIGHT YEAR =================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ================= MOBILE NAV TOGGLE =================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close the menu automatically when a link is clicked
  // (but skip the "Blog" toggle itself and dropdown category links,
  // those are handled separately below)
  navLinks.querySelectorAll('a').forEach(link => {
    if (link.classList.contains('dropdown-toggle') || link.closest('.dropdown-menu')) return;

    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ================= BLOG DROPDOWN (NAV SUBCATEGORY MENU) =================
const blogDropdown = document.querySelector('.nav-links .dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');

if (blogDropdown && dropdownToggle) {

  // On mobile, tapping "Blog" opens the submenu instead of
  // immediately jumping away; on desktop the CSS :hover handles it,
  // so this only needs to act inside the mobile slide-out menu.
  dropdownToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      blogDropdown.classList.toggle('active');
    }
  });

  // Clicking a category inside the dropdown: filter the blog cards,
  // scroll to the blog section, then close the mobile menu.
  blogDropdown.querySelectorAll('.dropdown-menu a[data-category]').forEach(link => {
    link.addEventListener('click', () => {
      const category = link.getAttribute('data-category');
      filterBlogCards(category);

      if (hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
      blogDropdown.classList.remove('active');
    });
  });
}

function filterBlogCards(category) {
  let visibleCount = 0;

  document.querySelectorAll('.blog-card').forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const isMatch = (category === 'all' || cardCategory === category);
    card.style.display = isMatch ? '' : 'none';
    if (isMatch) visibleCount++;
  });

  // Keep the on-page category buttons (if present) in sync
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });

  // Show a friendly message when a category has no posts yet
  const noPostsMessage = document.getElementById('noPostsMessage');
  if (noPostsMessage) {
    noPostsMessage.classList.toggle('show', visibleCount === 0);
  }
}

// ================= AUTO-FILTER BLOG PAGE FROM ?category= LINK =================
// Lets nav links on other pages (e.g. blog.html?category=AI) open
// the blog listing pre-filtered to that category.
if (document.querySelector('.blog-card')) {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    filterBlogCards(categoryParam);
  }
}

const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory =
            button.getAttribute("data-category");

        filterBlogCards(selectedCategory);

    });

});

// ================= HORIZONTAL CAROUSELS + CARD REVEAL =================
// Turns the gallery / projects / certificate rows into swipeable sliders:
// flanks each row with prev/next arrows, keeps the edge fades in sync with
// the scroll position, and reveals each card as it scrolls into view.
(function () {
  const rows = document.querySelectorAll(
    '.gallery-container, .project-container, .certificate-container'
  );
  if (!rows.length) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  rows.forEach(row => {
    // Skip if somehow already enhanced
    if (row.parentElement && row.parentElement.classList.contains('carousel')) return;

    // --- wrap the row so we can flank it with arrow buttons + edge fades ---
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    row.parentNode.insertBefore(carousel, row);
    carousel.appendChild(row);

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'carousel-arrow carousel-prev';
    prev.setAttribute('aria-label', 'Scroll left');
    prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'carousel-arrow carousel-next';
    next.setAttribute('aria-label', 'Scroll right');
    next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

    carousel.appendChild(prev);
    carousel.appendChild(next);

    const step = () => Math.max(row.clientWidth * 0.85, 240);
    prev.addEventListener('click', () =>
      row.scrollBy({ left: -step(), behavior: 'smooth' })
    );
    next.addEventListener('click', () =>
      row.scrollBy({ left: step(), behavior: 'smooth' })
    );

    function updateArrows() {
      const max = row.scrollWidth - row.clientWidth - 1;
      const scrollable = row.scrollWidth > row.clientWidth + 4;
      carousel.classList.toggle('has-overflow', scrollable);
      carousel.classList.toggle('at-start', row.scrollLeft <= 0);
      carousel.classList.toggle('at-end', row.scrollLeft >= max);
      prev.disabled = row.scrollLeft <= 0;
      next.disabled = row.scrollLeft >= max;
    }
    row.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    // Images can change the scroll width once they load
    row.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', updateArrows, { once: true });
    });
    updateArrows();

    // --- staggered reveal as each card scrolls into view ---
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const cards = Array.from(row.children);
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      cards.forEach((card, i) => {
        card.classList.add('reveal-card');
        card.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
        io.observe(card);
      });
    }
  });
})();