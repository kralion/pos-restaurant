import { supabase } from "./utils/supabase";

interface ExtendedRequest {
    url: string;
}

export async function middleware(req: ExtendedRequest) {
    const { data: { session } } = await supabase.auth.getSession();

    const authRequired = [
        "/(tabs)",
        "/(tabs)/chef-order",
        "/(tabs)/chef-order/details",
    ];
    const noAuthRequired = [
        "/(auth)/sign-in",
        "/(auth)/sign-up",
    ];

    // Si hay sesión activa
    if (session) {
        // Si el usuario está en una ruta que no requiere autenticación, redirigirlo
        if (noAuthRequired.includes(req.url)) {
            req.url = "/(tabs)";
        }
    } else {
        // Si no hay sesión activa y está intentando acceder a una ruta protegida, redirigir a login
        if (authRequired.includes(req.url)) {
            req.url = "/(auth)/sign-in";
        }
    }

    // Devolver la solicitud actualizada
    return req;
}
