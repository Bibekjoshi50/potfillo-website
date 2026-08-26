document.addEventListener("DOMContentLoaded", async () => {

    console.log("Login page loaded.");

    // Check Supabase client
    if (!window.supabaseClient) {

        console.error("❌ Supabase client was not created.");

        showMessage(
            "❌ Supabase connection failed.",
            true
        );

        return;
    }

    console.log("✅ Supabase client available.");

    // Check existing session
    const {
        data: {
            session
        },
        error
    } = await window.supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session check error:",
            error
        );

    }


    // Already logged in
    if (session) {

        console.log("Already logged in.");

        window.location.href =
            "./admin.html";

        return;

    }


    // Login form
    const form =
        document.getElementById("loginForm");


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const button =
                document.getElementById(
                    "loginButton"
                );


            button.disabled = true;

            button.textContent =
                "Logging in...";


            showMessage(
                "Checking login...",
                false
            );


            try {

                const {
                    data,
                    error
                } =
                    await window.supabaseClient
                        .auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    console.error(
                        "Login error:",
                        error
                    );

                    showMessage(
                        "❌ " + error.message,
                        true
                    );

                    button.disabled = false;

                    button.textContent =
                        "Login";

                    return;

                }


                console.log(
                    "✅ Login successful:",
                    data
                );


                showMessage(
                    "✅ Login successful. Redirecting...",
                    false
                );


                setTimeout(() => {

                    window.location.href =
                        "./admin.html";

                }, 500);


            } catch (err) {

                console.error(
                    "Unexpected error:",
                    err
                );

                showMessage(
                    "❌ Something went wrong.",
                    true
                );


                button.disabled = false;

                button.textContent =
                    "Login";

            }

        }
    );

});


function showMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "loginMessage"
        );


    if (!element) return;


    element.textContent =
        message;


    element.style.marginTop =
        "15px";


    element.style.fontWeight =
        "600";

}