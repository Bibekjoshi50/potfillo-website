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