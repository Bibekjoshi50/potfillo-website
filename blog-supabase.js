document.addEventListener("DOMContentLoaded", () => {
    loadSupabaseArticles();
});


async function loadSupabaseArticles() {

    const blogContainer = document.querySelector(".blog-container");

    if (!blogContainer) return;


    const {
        data: articles,
        error
    } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Error loading articles:",
            error
        );

        return;
    }


    if (!articles || articles.length === 0) {

        console.log("No published articles found.");

        return;
    }


    articles.forEach(article => {

        const card =
            document.createElement("div");

        card.className = "blog-card";

        card.setAttribute(
            "data-category",
            article.category
        );


        const image =
            article.image_url
                ? `<img
                    src="${escapeHTML(article.image_url)}"
                    alt="${escapeHTML(article.title)}"
                    width="400"
                    height="220"
                    loading="lazy">
                  `
                : `
                    <div class="blog-card-icon">
                        <i class="fa-solid fa-newspaper"></i>
                    </div>
                  `;


        const date =
            new Date(
                article.created_at
            ).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        card.innerHTML = `

            ${image}

            <div class="blog-content">

                <span class="blog-date">
                    ${date} • ${escapeHTML(article.category)}
                </span>

                <h3>
                    ${escapeHTML(article.title)}
                </h3>

                <p>
                    ${escapeHTML(article.excerpt || "")}
                </p>

                <a
                    href="article.html?slug=${encodeURIComponent(article.slug)}"
                    class="read-more">

                    Read More →

                </a>

            </div>

        `;


        blogContainer.insertBefore(
            card,
            blogContainer.firstChild
        );

    });


    setupCategoryFilters();

}


function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );

    const cards =
        document.querySelectorAll(
            ".blog-card"
        );

    const noPosts =
        document.getElementById(
            "noPostsMessage"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;


                buttons.forEach(btn => {
                    btn.classList.remove("active");
                });


                button.classList.add("active");


                let visibleCount = 0;


                cards.forEach(card => {

                    const cardCategory =
                        card.dataset.category;


                    if (
                        category === "all" ||
                        cardCategory === category
                    ) {

                        card.style.display = "";

                        visibleCount++;

                    } else {

                        card.style.display = "none";

                    }

                });


                if (noPosts) {

                    noPosts.style.display =
                        visibleCount === 0
                            ? "block"
                            : "none";

                }

            }
        );

    });

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}