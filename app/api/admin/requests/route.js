import { getDb, isAdmin } from "@/lib/server";

export const runtime = "nodejs";

export async function GET(request) {
  if (!(await isAdmin(request))) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = await getDb();

  const { data, error } = await db
    .from("collaboration_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Database error" },
      { status: 500 }
    );
  }

  return Response.json({ requests: data });
}

export async function PATCH(request) {
  if (!(await isAdmin(request))) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const db = await getDb();
    const { id, status } = await request.json();

    if (
      typeof id !== "string" ||
      !["accepted", "denied"].includes(status)
    ) {
      return Response.json(
        { error: "Invalid update" },
        { status: 400 }
      );
    }

    const { error } = await db
      .from("collaboration_requests")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Request update error:", error);
    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}