import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb() {
  const { env } = getCloudflareContext();

  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function isAdmin(request) {
  try {
    const { env } = getCloudflareContext();

    const token = request.cookies.get("admin_session")?.value;

    if (!token || !env.SESSION_SECRET) return false;

    const secret = new TextEncoder().encode(
      env.SESSION_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    return payload.admin === true;
  } catch (error) {
    console.error("Admin verification error:", error);
    return false;
  }
}