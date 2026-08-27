// ==========================================
// SUPABASE.JS
// Central Supabase configuration
// ==========================================

console.log("🚀 SUPABASE.JS STARTING...");

const SUPABASE_URL =
    "https://xbckbjfhecxvbgrymzwc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0VL9Y68IuyqqToI9bWaTcQ_eZExLBAT";

console.log("Supabase URL:", SUPABASE_URL);


// ==========================================
// CHECK SUPABASE LIBRARY
// ==========================================

if (!window.supabase) {

    console.error(
        "❌ Supabase JavaScript library is NOT loaded."
    );

    console.error(
        "Make sure the Supabase CDN script is loaded BEFORE supabase.js."
    );

} else {

    console.log(
        "✅ Supabase JavaScript library loaded."
    );


    // ======================================
    // CREATE SUPABASE CLIENT
    // ======================================

    try {

        window.supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        console.log(
            "✅ SUPABASE CLIENT CREATED SUCCESSFULLY"
        );

    } catch (error) {

        console.error(
            "❌ FAILED TO CREATE SUPABASE CLIENT:",
            error
        );

    }

}