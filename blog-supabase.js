document.addEventListener("DOMContentLoaded", () => {
    loadSupabaseArticles();
});


async function loadSupabaseArticles() {

    const blogContainer =
        document.querySelector(".blog-container");

    if (!blogContainer) return;

    if (!window.supabaseClient) {

        console.error(
            "Supabase client not found."
        );

        return;
    }


    const {
        data: articles,
        error
    } = await window.supabaseClient
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


    /*
       Remove previously generated
       Supabase cards.
    */

    document
        .querySelectorAll(
            ".supabase-article"
        )
        .forEach(card => card.remove());


    if (!articles || articles.length === 0) {

        updateNoPostsMessage();

        return;
    }


    /*
       Create cards
    */

    articles.forEach(article => {

        const card =
            document.createElement("article");

        card.className =
            "blog-card supabase-article";

        card.dataset.category =
            article.category || "";


        /* IMAGE */

        let imageHTML = "";

        if (article.image_url) {

            imageHTML = `
                <img
                    src="${escapeHTML(article.image_url)}"
                    alt="${escapeHTML(article.title)}"
                    width="400"
                    height="220"
                    loading="lazy"
                >
            `;

        } else {

            imageHTML = `
                <div class="blog-card-icon"
                     aria-hidden="true">

                    <i class="fa-solid fa-newspaper"></i>

                </div>
            `;
        }


        /* DATE */

        const date =
            article.created_at
                ? new Date(
                    article.created_at
                ).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                )
                : "";


        /* EXCERPT */

        const excerpt =
            article.excerpt ||
            getExcerptFromHTML(
                article.content
            );


        /* CARD */

        card.innerHTML = `

            ${imageHTML}

            <div class="blog-content">

                <span class="blog-date">

                    ${escapeHTML(date)}
                    •
                    ${escapeHTML(article.category || "")}

                </span>


                <h3>

                    ${escapeHTML(
                        article.title
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        excerpt
                    )}

                </p>


                <a
                    href="article.html?slug=${encodeURIComponent(article.slug)}"
                    class="read-more"
                >

                    Read More →

                </a>

            </div>

        `;


        blogContainer.prepend(card);

    });


    setupCategoryFilters();

    updateNoPostsMessage();

}


/* ==========================================
   CATEGORY FILTER
========================================== */

function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const category =
                    this.dataset.category;


                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                const cards =
                    document.querySelectorAll(
                        ".blog-card"
                    );


                let visibleCount = 0;


                cards.forEach(card => {

                    const cardCategory =
                        card.dataset.category;


                    if (
                        category === "all" ||
                        cardCategory === category
                    ) {

                        card.style.display =
                            "";

                        visibleCount++;

                    } else {

                        card.style.display =
                            "none";

                    }

                });


                const noPosts =
                    document.getElementById(
                        "noPostsMessage"
                    );


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


/* ==========================================
   NO POSTS MESSAGE
========================================== */

function updateNoPostsMessage() {

    const message =
        document.getElementById(
            "noPostsMessage"
        );

    if (!message) return;


    const cards =
        document.querySelectorAll(
            ".blog-card"
        );


    message.style.display =
        cards.length === 0
            ? "block"
            : "none";

}


/* ==========================================
   EXCERPT FROM HTML
========================================== */

function getExcerptFromHTML(
    html
) {

    if (!html) return "";


    const div =
        document.createElement(
            "div"
        );

    div.innerHTML = html;


    return (
        div.textContent ||
        div.innerText ||
        ""
    )
        .trim()
        .substring(
            0,
            180
        ) +
        "...";
}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;
}