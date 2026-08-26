console.log("SUPABASE.JS LOADED");

const SUPABASE_URL =
    "https://xbckbjfhecxvbgrymzwc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0VL9Y68IuyqqToI9bWaTcQ_eZExLBAT";


console.log("URL:", SUPABASE_URL);

console.log(
    "Supabase library:",
    window.supabase
);


if (!window.supabase) {

    console.error(
        "❌ Supabase library is missing"
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "✅ SUPABASE CLIENT CREATED"
    );

}