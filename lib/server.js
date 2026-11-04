
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";

export const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function isAdmin(request) {
  try {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) return false;

    const secret = new TextEncoder().encode(
      process.env.SESSION_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    return payload.admin === true;
  } catch {
    return false;
  }
}
