
async function loadRequests() {
  try {
    const response = await fetch("/api/admin/requests");
    const data = await response.json();

    if (!response.ok) {
      setLoggedIn(false);
      setError(
        data.error || `Request API failed: ${response.status}`
      );
      return;
    }

    setRequests(data.requests || []);
    setLoggedIn(true);
    setError("");
  } catch (error) {
    console.error("Loading requests failed:", error);
    setError(
      "Loading error: " + (error.message || "Unknown error")
    );
  }
}
