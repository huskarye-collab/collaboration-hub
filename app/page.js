
"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    username: "",
    contact: "",
    platform: "YouTube",
    message: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setResult("Your request has been submitted!");
      setForm({
        username: "",
        contact: "",
        platform: "YouTube",
        message: ""
      });
    } catch (error) {
      setResult(error.message || "Submission failed.");
    }

    setLoading(false);
  }

  return (
    <main className="public">
      <nav className="nav">
        <div className="brand">COLLAB<span>HUB</span></div>
        <a href="/admin">Owner Login</a>
      </nav>

      <section className="hero">
        <div className="tag">✦ COLLABORATE WITH US</div>
        <h1>Let's create<br/>
          <span>something amazing.</span>
        </h1>
        <p>
          Have an idea for a collaboration?
          Send us your request and we'll review it.
        </p>

        <form className="request-card" onSubmit={submit}>
          <h2>Collaboration Request</h2>
          <p className="muted">Fill in the details below.</p>

          <label>Your username</label>
          <input required minLength={2} maxLength={50}
            value={form.username}
            placeholder="Your username"
            onChange={e => setForm({...form,username:e.target.value})}
          />

          <label>Contact information</label>
          <input required minLength={3} maxLength={150}
            value={form.contact}
            placeholder="Email or Discord username"
            onChange={e => setForm({...form,contact:e.target.value})}
          />

          <label>Collaboration platform</label>
          <select value={form.platform}
            onChange={e => setForm({...form,platform:e.target.value})}>
            <option>YouTube</option>
            <option>Discord</option>
            <option>Roblox</option>
            <option>Other</option>
          </select>

          <label>Describe your idea</label>
          <textarea required minLength={10} maxLength={2000}
            rows={5}
            value={form.message}
            placeholder="Tell us your collaboration idea..."
            onChange={e => setForm({...form,message:e.target.value})}
          />

          <button disabled={loading}>
            {loading ? "Submitting..." : "Submit Request →"}
          </button>

          {result && <div className="result">{result}</div>}
        </form>
      </section>

      <footer>© 2026 CollabHub. All rights reserved.</footer>
    </main>
  );
}
