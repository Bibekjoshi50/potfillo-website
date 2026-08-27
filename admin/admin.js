/* ============================================================
   ADMIN.JS
   Main Admin Dashboard Logic
   ============================================================ */

"use strict";

console.log("🚀 ADMIN.JS LOADED");


/* ============================================================
   GLOBAL STATE
============================================================ */

let adminSession = null;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ Admin DOM loaded");

    initializeAdmin();

});


/* ============================================================
   INITIALIZE ADMIN
============================================================ */

async function initializeAdmin() {

    try {

        // Check Supabase
        if (!window.supabaseClient) {

            console.error(
                "❌ Supabase client not available."
            );

            showAdminError(
                "Supabase connection is not available. Please reload the page."
            );

            return;

        }


        console.log(
            "✅ Supabase client available"
        );


        // Check authentication
        const {
            data,
            error
        } =
            await window.supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "❌ Authentication error:",
                error
            );

            showAdminError(
                "Unable to verify your login session."
            );

            return;

        }


        adminSession = data.session;


        // No session
        if (!adminSession) {

            console.warn(
                "⚠️ No admin session found."
            );

            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "✅ Admin authenticated:",
            adminSession.user.email
        );


        // Initialize dashboard
        initializeDashboard();


    } catch (error) {

        console.error(
            "❌ Admin initialization failed:",
            error
        );

        showAdminError(
            "Something went wrong loading the admin dashboard."
        );

    }

}


/* ============================================================
   DASHBOARD
============================================================ */

function initializeDashboard() {

    console.log(
        "📊 Initializing dashboard..."
    );


    // Logout button
    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            handleLogout
        );

    }


    // Add dashboard animations
    initializeCardAnimations();


    console.log(
        "✅ Dashboard initialized"
    );

}


/* ============================================================
   LOGOUT
============================================================ */

async function handleLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    try {

        if (logoutBtn) {

            logoutBtn.disabled = true;

            logoutBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Logging out...';

        }


        const {
            error
        } =
            await window.supabaseClient
                .auth
                .signOut();


        if (error) {

            console.error(
                "❌ Logout error:",
                error
            );

            showAdminError(
                "Unable to logout. Please try again."
            );


            if (logoutBtn) {

                logoutBtn.disabled = false;

                logoutBtn.innerHTML =
                    '<i class="fa-solid fa-right-from-bracket"></i> Logout';

            }

            return;

        }


        console.log(
            "✅ Logout successful"
        );


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(
            "❌ Unexpected logout error:",
            error
        );


        if (logoutBtn) {

            logoutBtn.disabled = false;

            logoutBtn.innerHTML =
                '<i class="fa-solid fa-right-from-bracket"></i> Logout';

        }

    }

}


/* ============================================================
   CARD ANIMATIONS
============================================================ */

function initializeCardAnimations() {

    const cards =
        document.querySelectorAll(
            ".dashboard-card"
        );


    if (!cards.length) {
        return;
    }


    cards.forEach(
        function (card, index) {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(15px)";


            setTimeout(
                function () {

                    card.style.transition =
                        "opacity .35s ease, transform .35s ease";

                    card.style.opacity =
                        "1";

                    card.style.transform =
                        "translateY(0)";

                },
                index * 100
            );

        }
    );

}


/* ============================================================
   ADMIN ERROR MESSAGE
============================================================ */

function showAdminError(message) {

    console.error(
        "ADMIN ERROR:",
        message
    );


    // Use admin safety banner if available
    if (
        typeof window.adminShowErrorBanner ===
        "function"
    ) {

        window.adminShowErrorBanner(
            message
        );

        return;

    }


    // Fallback message
    const existing =
        document.getElementById(
            "adminErrorMessage"
        );


    if (existing) {
        return;
    }


    const errorBox =
        document.createElement(
            "div"
        );


    errorBox.id =
        "adminErrorMessage";


    errorBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: #dc2626;
        color: white;
        padding: 14px 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,.25);
        max-width: 90%;
    `;


    errorBox.textContent =
        message;


    document.body.appendChild(
        errorBox
    );

}


/* ============================================================
   AUTH STATE LISTENER
============================================================ */

if (window.supabaseClient) {

    window.supabaseClient
        .auth
        .onAuthStateChange(
            function (event, session) {

                console.log(
                    "🔐 Auth event:",
                    event
                );


                if (
                    event ===
                    "SIGNED_OUT"
                ) {

                    window.location.href =
                        "login.html";

                }

            }
        );

}


/* ============================================================
   GLOBAL ADMIN HELPERS
============================================================ */

window.adminApp = {

    getSession: function () {

        return adminSession;

    },


    logout: handleLogout,


    showError: showAdminError

};


console.log(
    "🛡️ ADMIN.JS READY"
);