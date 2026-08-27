/* ============================================================
   CREATE-ARTICLE.JS
   Bibek Joshi Admin Article Editor

   Uses the existing Supabase "articles" table.
   Does NOT require new database columns.

   Existing fields used:
   title
   slug
   category
   excerpt
   content
   image_url
   author
   seo_title
   seo_description
   seo_keywords
   published
============================================================ */

(function () {

    "use strict";

    /* ========================================================
       HELPERS
    ======================================================== */

    const $ = (id) => document.getElementById(id);

    const form = $("articleForm");
    const titleInput = $("title");
    const slugInput = $("slug");
    const excerptInput = $("excerpt");
    const contentInput = $("content");
    const categoryInput = $("category");
    const imageInput = $("image_url");
    const authorInput = $("author");
    const seoTitleInput = $("seo_title");
    const seoDescriptionInput = $("seo_description");
    const seoKeywordsInput = $("seo_keywords");
    const publishedInput = $("published");
    const publishBtn = $("publishBtn");
    const message = $("message");

    const DRAFT_KEY = "bibek_admin_article_draft";


    /* ========================================================
       SUPABASE
    ======================================================== */

    function getSupabase() {

        if (!window.supabaseClient) {

            showMessage(
                "Supabase connection is unavailable. Please reload the page.",
                "error"
            );

            return null;
        }

        return window.supabaseClient;
    }


    /* ========================================================
       MESSAGE
    ======================================================== */

    function showMessage(text, type = "info") {

        if (!message) return;

        message.textContent = text;

        message.className =
            "editor-message " + type;

    }


    /* ========================================================
       TOAST
    ======================================================== */

    function toast(text, type = "info") {

        if (
            window.adminDashboard &&
            typeof window.adminDashboard.showToast === "function"
        ) {

            window.adminDashboard.showToast(
                text,
                type
            );

            return;
        }


        let container =
            $("toastContainer");


        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "toastContainer";

            container.style.cssText =
                `
                position:fixed;
                right:20px;
                bottom:20px;
                z-index:99998;
                display:flex;
                flex-direction:column;
                gap:10px;
                `;

            document.body.appendChild(
                container
            );

        }


        const item =
            document.createElement("div");


        item.textContent =
            text;


        item.style.cssText =
            `
            padding:12px 16px;
            border-radius:10px;
            background:#111827;
            color:white;
            box-shadow:0 8px 25px rgba(0,0,0,.15);
            font-weight:600;
            max-width:350px;
            `;


        container.appendChild(
            item
        );


        setTimeout(() => {

            item.remove();

        }, 3500);

    }


    /* ========================================================
       AUTHENTICATION
    ======================================================== */

    async function checkAuth() {

        const supabase =
            getSupabase();

        if (!supabase) {
            return false;
        }


        try {

            const {
                data,
                error
            } =
                await supabase.auth.getSession();


            if (error) {

                console.error(
                    "Authentication error:",
                    error
                );

                showMessage(
                    "Authentication failed. Please reload.",
                    "error"
                );

                return false;
            }


            if (!data.session) {

                window.location.href =
                    "login.html";

                return false;
            }


            return true;

        } catch (error) {

            console.error(
                "Auth check failed:",
                error
            );

            showMessage(
                "Unable to verify your login session.",
                "error"
            );

            return false;
        }

    }


    /* ========================================================
       SLUG GENERATOR
    ======================================================== */

    function generateSlug(text) {

        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    }


    let slugManuallyEdited = false;


    if (titleInput && slugInput) {

        titleInput.addEventListener(
            "input",
            function () {

                if (!slugManuallyEdited) {

                    slugInput.value =
                        generateSlug(
                            titleInput.value
                        );

                }

                updateEditorStats();

                markUnsaved();

            }
        );


        slugInput.addEventListener(
            "input",
            function () {

                slugManuallyEdited =
                    true;

                slugInput.value =
                    generateSlug(
                        slugInput.value
                    );

                markUnsaved();

            }
        );

    }


    /* ========================================================
       WORD COUNT
    ======================================================== */

    function getWordCount(text) {

        if (!text || !text.trim()) {
            return 0;
        }

        return text
            .trim()
            .split(/\s+/)
            .length;

    }


    /* ========================================================
       READING TIME
    ======================================================== */

    function getReadingTime(text) {

        const words =
            getWordCount(text);

        return Math.max(
            1,
            Math.ceil(words / 200)
        );

    }


    /* ========================================================
       EDITOR STATS
    ======================================================== */

    function updateEditorStats() {

        const content =
            contentInput
                ? contentInput.value
                : "";


        const excerpt =
            excerptInput
                ? excerptInput.value
                : "";


        const words =
            getWordCount(content);


        const readingTime =
            getReadingTime(content);


        setText(
            "wordCount",
            words
        );


        setText(
            "readingTime",
            readingTime + " min"
        );


        setText(
            "contentCharacters",
            content.length
        );


        setText(
            "excerptCharacters",
            excerpt.length
        );


        updateSEOStats();

    }


    /* ========================================================
       SEO STATS
    ======================================================== */

    function updateSEOStats() {

        const seoTitle =
            seoTitleInput
                ? seoTitleInput.value
                : "";


        const seoDescription =
            seoDescriptionInput
                ? seoDescriptionInput.value
                : "";


        setText(
            "seoTitleCount",
            seoTitle.length
        );


        setText(
            "seoDescriptionCount",
            seoDescription.length
        );


        updateSEOPreview();

    }


    /* ========================================================
       SET TEXT
    ======================================================== */

    function setText(
        id,
        value
    ) {

        const element =
            $(id);


        if (element) {

            element.textContent =
                value;

        }

    }


    /* ========================================================
       IMAGE PREVIEW
    ======================================================== */

    function createImagePreview() {

        if (!imageInput) {
            return;
        }


        let wrapper =
            $("imagePreview");


        if (!wrapper) {

            wrapper =
                document.createElement("div");

            wrapper.id =
                "imagePreview";

            wrapper.style.cssText =
                `
                margin-top:12px;
                display:none;
                position:relative;
                border-radius:12px;
                overflow:hidden;
                background:#f3f4f6;
                border:1px solid #e5e7eb;
                `;


            imageInput
                .parentElement
                .appendChild(wrapper);

        }


        imageInput.addEventListener(
            "input",
            function () {

                previewImage(
                    imageInput.value.trim()
                );

                markUnsaved();

            }
        );


        previewImage(
            imageInput.value.trim()
        );

    }


    function previewImage(url) {

        const wrapper =
            $("imagePreview");


        if (!wrapper) {
            return;
        }


        if (!url) {

            wrapper.style.display =
                "none";

            wrapper.innerHTML =
                "";

            return;
        }


        try {

            new URL(url);

        } catch {

            wrapper.style.display =
                "none";

            return;

        }


        wrapper.style.display =
            "block";


        wrapper.innerHTML =
            `
            <img
                src="${escapeHTML(url)}"
                alt="Featured image preview"
                style="
                    width:100%;
                    max-height:240px;
                    object-fit:cover;
                    display:block;
                "
            >

            <button
                type="button"
                id="removeImageBtn"
                style="
                    position:absolute;
                    top:10px;
                    right:10px;
                    border:0;
                    border-radius:7px;
                    padding:7px 10px;
                    background:rgba(0,0,0,.75);
                    color:white;
                    cursor:pointer;
                    font-weight:700;
                "
            >
                <i class="fa-solid fa-xmark"></i>
                Remove
            </button>
            `;


        const img =
            wrapper.querySelector("img");


        img.addEventListener(
            "error",
            function () {

                wrapper.innerHTML =
                    `
                    <div
                        style="
                            padding:20px;
                            text-align:center;
                            color:#b91c1c;
                        "
                    >
                        <i
                            class="fa-solid fa-image"
                            style="font-size:30px;"
                        ></i>

                        <p>
                            Unable to load this image.
                        </p>
                    </div>
                    `;

            }
        );


        const removeButton =
            $("removeImageBtn");


        if (removeButton) {

            removeButton.addEventListener(
                "click",
                function () {

                    imageInput.value =
                        "";

                    wrapper.style.display =
                        "none";

                    wrapper.innerHTML =
                        "";

                    markUnsaved();

                }
            );

        }

    }


    /* ========================================================
       SEO PREVIEW
    ======================================================== */

    function updateSEOPreview() {

        let preview =
            $("seoPreview");


        if (!preview) {
            return;
        }


        const title =
            seoTitleInput.value.trim() ||
            titleInput.value.trim() ||
            "Your article title";


        const description =
            seoDescriptionInput.value.trim() ||
            excerptInput.value.trim() ||
            "Your article description will appear here.";


        const slug =
            slugInput.value.trim() ||
            "article-url";


        preview.innerHTML =
            `
            <div
                style="
                    padding:16px;
                    border:1px solid #e5e7eb;
                    border-radius:10px;
                    background:#fff;
                "
            >

                <div
                    style="
                        color:#1a0dab;
                        font-size:18px;
                        margin-bottom:5px;
                    "
                >
                    ${escapeHTML(title)}
                </div>

                <div
                    style="
                        color:#16803c;
                        font-size:13px;
                        margin-bottom:6px;
                    "
                >
                    bibekjoshi50.com.np/blog/${escapeHTML(slug)}
                </div>

                <div
                    style="
                        color:#4b5563;
                        font-size:14px;
                        line-height:1.5;
                    "
                >
                    ${escapeHTML(description)}
                </div>

            </div>
            `;

    }


    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;

    }


    /* ========================================================
       LOCAL DRAFT
    ======================================================== */

    function collectFormData() {

        return {

            title:
                titleInput.value,

            slug:
                slugInput.value,

            excerpt:
                excerptInput.value,

            content:
                contentInput.value,

            category:
                categoryInput.value,

            image_url:
                imageInput.value,

            author:
                authorInput.value,

            seo_title:
                seoTitleInput.value,

            seo_description:
                seoDescriptionInput.value,

            seo_keywords:
                seoKeywordsInput.value,

            published:
                publishedInput.checked

        };

    }


    function saveLocalDraft() {

        const data =
            collectFormData();


        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(data)
        );


        setText(
            "draftStatus",
            "Draft saved locally"
        );

    }


    function restoreLocalDraft() {

        const saved =
            localStorage.getItem(
                DRAFT_KEY
            );


        if (!saved) {
            return;
        }


        try {

            const data =
                JSON.parse(saved);


            const restore =
                confirm(
                    "A previously saved draft was found. Do you want to restore it?"
                );


            if (!restore) {

                localStorage.removeItem(
                    DRAFT_KEY
                );

                return;

            }


            titleInput.value =
                data.title || "";


            slugInput.value =
                data.slug || "";


            excerptInput.value =
                data.excerpt || "";


            contentInput.value =
                data.content || "";


            categoryInput.value =
                data.category || "";


            imageInput.value =
                data.image_url || "";


            authorInput.value =
                data.author ||
                "Bibek Joshi";


            seoTitleInput.value =
                data.seo_title || "";


            seoDescriptionInput.value =
                data.seo_description || "";


            seoKeywordsInput.value =
                data.seo_keywords || "";


            publishedInput.checked =
                data.published !== false;


            slugManuallyEdited =
                true;


            previewImage(
                imageInput.value.trim()
            );


            updateEditorStats();


            updateSEOPreview();


            toast(
                "Draft restored successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "Draft restore failed:",
                error
            );

            localStorage.removeItem(
                DRAFT_KEY
            );

        }

    }


    let autoSaveTimer;


    function setupAutoSave() {

        form.addEventListener(
            "input",
            function () {

                markUnsaved();


                clearTimeout(
                    autoSaveTimer
                );


                autoSaveTimer =
                    setTimeout(
                        saveLocalDraft,
                        1500
                    );


                updateEditorStats();

            }
        );

    }


    /* ========================================================
       UNSAVED CHANGES
    ======================================================== */

    let hasUnsavedChanges =
        false;


    function markUnsaved() {

        hasUnsavedChanges =
            true;

    }


    function clearUnsaved() {

        hasUnsavedChanges =
            false;

    }


    window.addEventListener(
        "beforeunload",
        function (event) {

            if (!hasUnsavedChanges) {
                return;
            }


            event.preventDefault();

            event.returnValue =
                "";

        }
    );


    /* ========================================================
       CLEAR LOCAL DRAFT
    ======================================================== */

    function setupClearDraft() {

        const button =
            $("clearDraftBtn");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Clear your locally saved draft?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    DRAFT_KEY
                );


                toast(
                    "Local draft cleared.",
                    "success"
                );


                setText(
                    "draftStatus",
                    "No local draft"
                );

            }
        );

    }


    /* ========================================================
       PREVIEW
    ======================================================== */

    function setupPreview() {

        const button =
            $("previewBtn");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                const previewWindow =
                    window.open(
                        "",
                        "_blank"
                    );


                if (!previewWindow) {

                    toast(
                        "Please allow pop-ups to preview the article.",
                        "warning"
                    );

                    return;
                }


                const title =
                    titleInput.value.trim() ||
                    "Article Preview";


                const image =
                    imageInput.value.trim();


                const category =
                    categoryInput.value ||
                    "Article";


                const content =
                    contentInput.value ||
                    "<p>No content yet.</p>";


                previewWindow.document.write(
                    `
                    <!DOCTYPE html>

                    <html>

                    <head>

                        <meta charset="UTF-8">

                        <meta
                            name="viewport"
                            content="width=device-width,initial-scale=1"
                        >

                        <title>
                            ${escapeHTML(title)}
                        </title>

                        <style>

                            body {
                                margin:0;
                                background:#f5f7fb;
                                color:#1f2937;
                                font-family:Arial,sans-serif;
                            }

                            .preview {
                                max-width:850px;
                                margin:40px auto;
                                background:white;
                                padding:40px;
                                border-radius:16px;
                                box-shadow:
                                    0 10px 35px
                                    rgba(0,0,0,.08);
                            }

                            img {
                                width:100%;
                                max-height:450px;
                                object-fit:cover;
                                border-radius:12px;
                                margin:20px 0;
                            }

                            .category {
                                color:#2563eb;
                                font-weight:700;
                            }

                            h1 {
                                font-size:40px;
                                line-height:1.2;
                            }

                            .content {
                                font-size:17px;
                                line-height:1.8;
                            }

                            @media(max-width:600px) {

                                .preview {
                                    margin:0;
                                    border-radius:0;
                                    padding:22px;
                                }

                                h1 {
                                    font-size:30px;
                                }

                            }

                        </style>

                    </head>

                    <body>

                        <article class="preview">

                            <div class="category">
                                ${escapeHTML(category)}
                            </div>

                            <h1>
                                ${escapeHTML(title)}
                            </h1>

                            ${
                                image
                                ?
                                `<img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(title)}"
                                >`
                                :
                                ""
                            }

                            <div class="content">
                                ${content}
                            </div>

                        </article>

                    </body>

                    </html>
                    `
                );


                previewWindow.document.close();

            }
        );

    }


    /* ========================================================
       PUBLISH BUTTON STATE
    ======================================================== */

    function updatePublishButton() {

        if (!publishBtn) {
            return;
        }


        if (publishedInput.checked) {

            publishBtn.innerHTML =
                `
                <i class="fa-solid fa-paper-plane"></i>
                Publish Article
                `;

        } else {

            publishBtn.innerHTML =
                `
                <i class="fa-solid fa-floppy-disk"></i>
                Save Draft
                `;

        }

    }


    if (publishedInput) {

        publishedInput.addEventListener(
            "change",
            function () {

                updatePublishButton();

                markUnsaved();

            }
        );

    }


    /* ========================================================
       VALIDATION
    ======================================================== */

    function validateArticle() {

        const errors = [];


        if (
            !titleInput.value.trim()
        ) {

            errors.push(
                "Article title is required."
            );

        }


        if (
            !slugInput.value.trim()
        ) {

            errors.push(
                "URL slug is required."
            );

        }


        if (
            !categoryInput.value
        ) {

            errors.push(
                "Please select a category."
            );

        }


        if (
            !contentInput.value.trim()
        ) {

            errors.push(
                "Article content is required."
            );

        }


        if (
            imageInput.value.trim()
        ) {

            try {

                new URL(
                    imageInput.value.trim()
                );

            } catch {

                errors.push(
                    "Featured image URL is not valid."
                );

            }

        }


        return errors;

    }


    /* ========================================================
       CREATE ARTICLE
    ======================================================== */

    async function submitArticle(event) {

        event.preventDefault();


        const supabase =
            getSupabase();


        if (!supabase) {
            return;
        }


        const errors =
            validateArticle();


        if (errors.length) {

            showMessage(
                errors.join(" "),
                "error"
            );


            toast(
                errors[0],
                "error"
            );


            return;

        }


        publishBtn.disabled =
            true;


        const isPublished =
            publishedInput.checked;


        publishBtn.innerHTML =
            `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${isPublished ? "Publishing..." : "Saving Draft..."}
            `;


        showMessage(
            isPublished
                ? "Publishing article..."
                : "Saving draft...",
            "info"
        );


        const article = {

            title:
                titleInput.value.trim(),

            slug:
                slugInput.value.trim(),

            category:
                categoryInput.value,

            excerpt:
                excerptInput.value.trim(),

            content:
                contentInput.value,

            image_url:
                imageInput.value.trim() ||
                null,

            author:
                authorInput.value.trim() ||
                "Bibek Joshi",

            seo_title:
                seoTitleInput.value.trim() ||
                null,

            seo_description:
                seoDescriptionInput.value.trim() ||
                null,

            seo_keywords:
                seoKeywordsInput.value.trim() ||
                null,

            published:
                isPublished

        };


        try {

            const {
                data,
                error
            } =
                await supabase
                    .from("articles")
                    .insert([article])
                    .select();


            if (error) {

                console.error(
                    "Supabase insert error:",
                    error
                );


                showMessage(
                    "❌ " +
                    error.message,
                    "error"
                );


                toast(
                    error.message,
                    "error"
                );


                resetPublishButton();

                return;

            }


            console.log(
                "✅ Article created:",
                data
            );


            clearUnsaved();


            localStorage.removeItem(
                DRAFT_KEY
            );


            showMessage(
                isPublished
                    ? "✅ Article published successfully!"
                    : "✅ Draft saved successfully!",
                "success"
            );


            toast(
                isPublished
                    ? "Article published successfully."
                    : "Draft saved successfully.",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "articles.html";

                },
                900
            );


        } catch (error) {

            console.error(
                "❌ Article creation failed:",
                error
            );


            showMessage(
                "❌ " +
                (
                    error.message ||
                    "Something went wrong while saving the article."
                ),
                "error"
            );


            toast(
                "Article could not be saved.",
                "error"
            );


            resetPublishButton();

        }

    }


    /* ========================================================
       RESET BUTTON
    ======================================================== */

    function resetPublishButton() {

        publishBtn.disabled =
            false;

        updatePublishButton();

    }


    /* ========================================================
       CHARACTER COUNTERS
    ======================================================== */

    function setupCounters() {

        const fields = [

            {
                input: excerptInput,
                counter: "excerptCharacters"
            },

            {
                input: contentInput,
                counter: "contentCharacters"
            },

            {
                input: seoTitleInput,
                counter: "seoTitleCount"
            },

            {
                input: seoDescriptionInput,
                counter: "seoDescriptionCount"
            }

        ];


        fields.forEach(
            function (item) {

                if (!item.input) {
                    return;
                }


                item.input.addEventListener(
                    "input",
                    function () {

                        setText(
                            item.counter,
                            item.input.value.length
                        );

                    }
                );

            }
        );

    }


    /* ========================================================
       KEYBOARD SHORTCUTS
    ======================================================== */

    function setupKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            function (event) {

                /*
                 * Ctrl + S
                 * Save locally
                 */

                if (
                    (event.ctrlKey ||
                     event.metaKey) &&
                    event.key.toLowerCase() === "s"
                ) {

                    event.preventDefault();

                    saveLocalDraft();

                    toast(
                        "Draft saved locally.",
                        "success"
                    );

                }


                /*
                 * Ctrl + Enter
                 * Submit article
                 */

                if (
                    (event.ctrlKey ||
                     event.metaKey) &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    form.requestSubmit();

                }

            }
        );

    }


    /* ========================================================
       INITIALIZE
    ======================================================== */

    async function init() {

        console.log(
            "🚀 Create Article editor starting..."
        );


        if (!form) {

            console.error(
                "Article form not found."
            );

            return;

        }


        const authenticated =
            await checkAuth();


        if (!authenticated) {
            return;
        }


        createImagePreview();

        setupAutoSave();

        setupClearDraft();

        setupPreview();

        setupCounters();

        setupKeyboardShortcuts();


        updateEditorStats();

        updatePublishButton();

        updateSEOPreview();


        restoreLocalDraft();


        console.log(
            "✅ Create Article editor initialized."
        );

    }


    /* ========================================================
       DOM READY
    ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();