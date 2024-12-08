import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseRoleKey = process.env.EXPO_PUBLIC_SUPABASE_ROLE_KEY!;
console.log(supabaseURL, supabaseRoleKey);

if (!supabaseURL || !supabaseRoleKey) {
    throw new Error("Missing Supabase URL or Role Key");
}
export const supabaseAdmin = createClient(
    supabaseURL,
    supabaseRoleKey
);