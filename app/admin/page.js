"use client";

import { useEffect, useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadRequests() {
    try {
      const response = await fetch("/api/admin/requests");
      const data = await response.json();

      if (!response.ok) {
        setLoggedIn(false);
        return;
      }

      setRequests(data.requests);
      setLoggedIn(true);
    } catch {
      setError("Could not load requests.");
    }
  }

  async function login(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      await loadRequests();
      setPassword("");
    } catch {
      setError("Connection error. Please try again.");
    }

    setLoading(false);
  }

  async function update(id, status) {
    const response = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });

    if (response.ok) {
      await loadRequests();
    } else {
      setError("Could not update request.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setRequests([]);
    setPassword("");
  }

  useEffect(() => {
    loadRequests();
  }, []);

  if (!loggedIn) {
    return (
      <main className="admin">
        <form className="login-card" onSubmit={login}>
          <h1>Owner Login</h1>
          <p>Enter your administrator password.</p>

          <input
            type="password"
            required
            value={password}
            placeholder="Admin password"
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>

          {error && <p>{error}</p>}
        </form>
      </main>
    );
  }

  const pending = requests.filter(r => r.status === "pending").length;
  const accepted = requests.filter(r => r.status === "accepted").length;
  const denied = requests.filter(r => r.status === "denied").length;

  return (
    <main className="admin">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your collaboration requests.</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="stats">
        <div><b>{pending}</b><span>Pending</span></div>
        <div><b>{accepted}</b><span>Accepted</span></div>
        <div><b>{denied}</b><span>Denied</span></div>
      </div>

      <h2>Incoming Requests</h2>

      {requests.length === 0 && <p>No requests yet.</p>}

      {requests.map(r => (
        <article className="request-item" key={r.id}>
          <div className="request-top">
            <h3>{r.username}</h3>
            <span className={"status " + r.status}>{r.status}</span>
          </div>

          <p><b>Platform:</b> {r.platform}</p>
          <p><b>Contact:</b> {r.contact}</p>
          <p className="message">{r.message}</p>

          <small>{new Date(r.created_at).toLocaleString()}</small>

          {r.status === "pending" && (
            <div className="actions">
              <button onClick={() => update(r.id, "accepted")}>
                Accept
              </button>
              <button
                className="deny"
                onClick={() => update(r.id, "denied")}
              >
                Deny
              </button>
            </div>
          )}
        </article>
      ))}
    </main>
  );
}