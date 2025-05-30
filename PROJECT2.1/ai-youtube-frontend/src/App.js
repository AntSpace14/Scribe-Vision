import React, { useState } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function App() {
  const [mode, setMode] = useState("url");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [videosUsed, setVideosUsed] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setComments([]);
    setSummary("");
    setKeywords([]);
    setVideosUsed([]);

    const endpoint = mode === "url" ? "url" : "theme";
    const payload = mode === "url"
      ? { videoId: extractVideoId(input) }
      : { theme: input };

    if (mode === "url" && !payload.videoId) {
      setError("Invalid YouTube URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/comments/${endpoint}`, payload);

      setComments(res.data.comments);
      setSummary(res.data.summary);
      setKeywords(res.data.keywords || []);
      setVideosUsed(res.data.videosUsed || []);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url) => {
    try {
      const parsed = new URL(url);
  
      // For short links like youtu.be/abc123
      if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
  
      if (parsed.hostname.includes("youtube.com")) {
        // Standard videos: youtube.com/watch?v=abc123
        if (parsed.searchParams.has("v")) return parsed.searchParams.get("v");
  
        // Embedded videos: youtube.com/embed/abc123
        if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/embed/")[1];
  
        // Shorts: youtube.com/shorts/abc123
        if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/shorts/")[1];
      }
    } catch {}
  
    return null;
  };
  

  return (
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: "30px",
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    }}>
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ marginBottom: 6, fontSize: "2rem", color: "#222" }}>📽️ Scribe-Vision</h1>
        <p style={{ color: "#666", fontSize: "1rem" }}>
          A YouTube Comment Analyzer for Writers – by Antariksh Sarmah
        </p>
      </header>

      <section style={{
  background: "#f0f4ff",
  padding: "20px",
  borderRadius: "10px",
  borderLeft: "6px solid #007bff",
  marginBottom: "30px",
  color: "#333"
}}>
  <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "1.1rem", color: "#0056b3" }}>
    What is Scribe-Vision?
  </h3>
  <p style={{ marginBottom: "8px", lineHeight: "1.6" }}>
    <strong>Scribe-Vision</strong> is a YouTube comment analyzer designed for writers, creators, and researchers.
    It helps uncover public opinion, emotional trends, and key themes from real viewer comments.
  </p>

  <h4 style={{ margin: "12px 0 6px", fontSize: "1rem", color: "#004080" }}>
    Components:
  </h4>
  <p style={{ marginBottom: "8px", lineHeight: "1.6" }}>
    It's essentially a MERN stack based application that leverages two APIs namely: <strong>Youtube Data API v3</strong> and <strong>Hugging Face's</strong> to leverage comment scraping and subsequent insight summarizing through <strong>mistralai/Mistral-Small-3.1-24B-Instruct-2503</strong>. It also extracts keywords using <strong>keyword-extractor</strong> and assigns sentiment score using<strong> vader-sentiment</strong>
  </p>
  <h4 style={{ margin: "12px 0 6px", fontSize: "1rem", color: "#004080" }}>
    How to Use:
  </h4>
  <ul style={{ paddingLeft: "18px", margin: 0, lineHeight: "1.6" }}>
    <li><strong>Analyze by Video URL:</strong> Paste a YouTube link to analyze comments on that specific video.</li>
    <li><strong>Analyze by Theme:</strong> Enter a topic (e.g. “100 men vs 1 Gorilla”) to search related videos and analyze top comments across them.</li>
  </ul>
</section>


      <section style={{ marginBottom: 24, textAlign: "center" }}>
        <label style={{ marginRight: 20 }}>
          <input
            type="radio"
            value="url"
            checked={mode === "url"}
            onChange={() => setMode("url")}
          /> Analyze by Video URL
        </label>
        <label>
          <input
            type="radio"
            value="theme"
            checked={mode === "theme"}
            onChange={() => setMode("theme")}
          /> Analyze by Theme
        </label>
      </section>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", marginBottom: 12 }}>
        <input
          type="text"
          placeholder={mode === "url" ? "Enter YouTube URL" : "Enter a theme or keyword"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem"
        }}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      {summary && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: "1.3rem", marginBottom: 12 }}>📊 Insight Summary</h3>
          <div style={{
            background: "#f4f8fb",
            padding: "16px",
            borderRadius: "10px",
            lineHeight: "1.7em",
            color: "#333"
          }}>
            {summary
              .split("\n")
              .map(line =>
                line
                  .replace(/^#+\s*/, "")
                  .replace(/^[-*•]\s*/, "")
                  .trim()
              )
              .filter(line => line.length > 0)
              .map((line, idx) => {
                const isHeading = line.endsWith(":") && /^[A-Z]/.test(line) && line.split(" ").length < 12;
                return (
                  <p key={idx} style={{
                    fontWeight: isHeading ? "bold" : "normal",
                    fontSize: isHeading ? "1.05em" : "1em",
                    marginBottom: "6px"
                  }}>
                    {line}
                  </p>
                );
              })}
          </div>
        </section>
      )}

      {keywords.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>🔑 Top Keywords</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {keywords.slice(0, 30).map((kw, i) => (
              <span key={i} style={{
                background: "#e6f0ff",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                color: "#004080"
              }}>{kw}</span>
            ))}
          </div>
        </section>
      )}

      {mode === "theme" && videosUsed.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>🎬 Videos Analyzed</h3>
          <ul style={{ paddingLeft: 20 }}>
            {videosUsed.map((vid, idx) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  {vid.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {comments.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>
            💬 Top Comments ({comments.length})
          </h3>
          <ul style={{ maxHeight: 300, overflowY: "auto", padding: 0 }}>
            {comments.map((c, i) => (
              <li key={i} style={{
                listStyle: "none",
                borderBottom: "1px solid #eee",
                marginBottom: 12,
                paddingBottom: 10
              }}>
                <p style={{ marginBottom: 4 }}>
                  <strong>@{c.username}</strong> &nbsp;
                  <span style={{ color: "#666" }}>({c.likes} likes)</span> —{" "}
                  <em style={{
                    color: c.sentiment === "positive" ? "green" :
                          c.sentiment === "negative" ? "red" : "#999"
                  }}>
                    {c.sentiment}
                  </em>
                </p>
                <p style={{ margin: 0 }}>{c.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
