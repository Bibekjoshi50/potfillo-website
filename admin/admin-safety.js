/* ============================================================
   ADMIN-SAFETY.JS
   Bibek Joshi Admin Panel

   Purpose:
   - Prevent blank/white screens
   - Catch JavaScript errors
   - Catch failed background requests
   - Show user-friendly error messages
   - Keep real errors visible in the browser console
   - Provide Reload and Dismiss options
============================================================ */

(function () {

    "use strict";


    /* ========================================================
       CONFIGURATION
    ======================================================== */

    var bannerShown = false;

    var bannerElement = null;


    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    function escapeHTML(value) {

        var div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;

    }


    /* ========================================================
       SHOW ERROR BANNER
    ======================================================== */

    function showBanner(message) {

        /*
         * Don't create multiple banners
         */
        if (bannerShown) {

            return;

        }


        bannerShown = true;


        /* ----------------------------------------------------
           Create banner
        ---------------------------------------------------- */

        var bar =
            document.createElement("div");


        bannerElement =
            bar;


        bar.setAttribute(
            "role",
            "alert"
        );


        bar.setAttribute(
            "aria-live",
            "assertive"
        );


        bar.style.cssText =

            "position:fixed;" +
            "top:0;" +
            "left:0;" +
            "right:0;" +
            "z-index:99999;" +

            "background:#b91c1c;" +
            "color:#fff;" +

            "padding:14px 18px;" +

            "font:600 14px/1.4 Arial,sans-serif;" +

            "display:flex;" +
            "align-items:center;" +
            "justify-content:space-between;" +

            "gap:16px;" +

            "box-shadow:0 4px 16px rgba(0,0,0,.25);";


        /* ----------------------------------------------------
           Message
        ---------------------------------------------------- */

        var text =
            document.createElement("div");


        text.style.cssText =
            "flex:1;";


        text.textContent =
            message ||
            "Something went wrong loading this page. Please try again.";


        /* ----------------------------------------------------
           Actions
        ---------------------------------------------------- */

        var actions =
            document.createElement("div");


        actions.style.cssText =

            "display:flex;" +
            "gap:8px;" +
            "flex-shrink:0;" +
            "align-items:center;";


        /* ====================================================
           RELOAD BUTTON
        ==================================================== */

        var reloadBtn =
            document.createElement("button");


        reloadBtn.type =
            "button";


        reloadBtn.textContent =
            "Reload";


        reloadBtn.setAttribute(
            "aria-label",
            "Reload page"
        );


        reloadBtn.style.cssText =

            "background:#fff;" +
            "color:#111827;" +
            "border:none;" +

            "padding:8px 14px;" +

            "border-radius:7px;" +

            "cursor:pointer;" +

            "font-weight:700;";


        reloadBtn.onclick =
            function () {

                window.location.reload();

            };


        /* ====================================================
           DISMISS BUTTON
        ==================================================== */

        var dismissBtn =
            document.createElement("button");


        dismissBtn.type =
            "button";


        dismissBtn.textContent =
            "Dismiss";


        dismissBtn.setAttribute(
            "aria-label",
            "Dismiss error message"
        );


        dismissBtn.style.cssText =

            "background:transparent;" +
            "color:#fff;" +

            "border:1px solid rgba(255,255,255,.55);" +

            "padding:8px 14px;" +

            "border-radius:7px;" +

            "cursor:pointer;" +

            "font-weight:600;";


        dismissBtn.onclick =
            function () {

                hideBanner();

            };


        /* ====================================================
           BUILD BANNER
        ==================================================== */

        actions.appendChild(
            reloadBtn
        );


        actions.appendChild(
            dismissBtn
        );


        bar.appendChild(
            text
        );


        bar.appendChild(
            actions
        );


        /* ====================================================
           ADD TO PAGE
        ==================================================== */

        if (document.body) {

            document.body.appendChild(
                bar
            );

        } else {

            document.addEventListener(
                "DOMContentLoaded",
                function () {

                    document.body.appendChild(
                        bar
                    );

                },
                {
                    once: true
                }
            );

        }

    }


    /* ========================================================
       HIDE ERROR BANNER
    ======================================================== */

    function hideBanner() {

        if (
            bannerElement &&
            bannerElement.parentNode
        ) {

            bannerElement.parentNode.removeChild(
                bannerElement
            );

        }


        bannerElement =
            null;


        bannerShown =
            false;

    }


    /* ========================================================
       GLOBAL JAVASCRIPT ERROR HANDLER
    ======================================================== */

    window.addEventListener(
        "error",
        function (event) {

            console.error(
                "❌ Uncaught admin error:",
                event.error ||
                event.message,
                event
            );


            showBanner(
                "Something went wrong. Your data is safe — try reloading the page."
            );

        }
    );


    /* ========================================================
       UNHANDLED PROMISE REJECTION
    ======================================================== */

    window.addEventListener(
        "unhandledrejection",
        function (event) {

            console.error(
                "❌ Unhandled promise rejection:",
                event.reason
            );


            showBanner(
                "A background request failed. Try reloading the page."
            );

        }
    );


    /* ========================================================
       RESOURCE ERROR HANDLER
       
       Detect failed scripts, CSS, images, etc.
    ======================================================== */

    window.addEventListener(
        "error",
        function (event) {

            var target =
                event.target;


            if (
                !target ||
                target === window
            ) {

                return;

            }


            var tagName =
                target.tagName
                ? target.tagName.toLowerCase()
                : "";


            if (
                tagName === "script" ||
                tagName === "link" ||
                tagName === "img"
            ) {

                console.error(
                    "❌ Resource failed:",
                    target.src ||
                    target.href ||
                    target
                );


                /*
                 * Don't immediately show a scary banner
                 * for every image failure.
                 *
                 * Scripts and CSS are more important.
                 */

                if (
                    tagName === "script" ||
                    tagName === "link"
                ) {

                    showBanner(
                        "A required website file failed to load. Please reload the page."
                    );

                }

            }

        },
        true
    );


    /* ========================================================
       MANUAL ERROR FUNCTION
       
       Other admin files can call:
       
       adminShowErrorBanner("Message");
    ======================================================== */

    window.adminShowErrorBanner =
        function (message) {

            console.error(
                "Admin error:",
                message
            );


            showBanner(
                message
            );

        };


    /* ========================================================
       HIDE ERROR FUNCTION
       
       Other admin files can call:
       
       adminHideErrorBanner();
    ======================================================== */

    window.adminHideErrorBanner =
        function () {

            hideBanner();

        };


    /* ========================================================
       READY MESSAGE
    ======================================================== */

    console.log(
        "🛡️ ADMIN SAFETY SYSTEM LOADED"
    );


})();