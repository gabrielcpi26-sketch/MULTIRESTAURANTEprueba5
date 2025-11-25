import { createClient } from "@supabase/supabase-js";

// SOLO por Vite:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] Faltan variables de entorno, usando modo demo.");
}

// si falta la KEY, igualmente se rompe, pero al menos sabes por qué
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;



