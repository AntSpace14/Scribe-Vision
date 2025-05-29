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
      if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
      if (parsed.hostname.includes("youtube.com")) {
        if (parsed.searchParams.has("v")) return parsed.searchParams.get("v");
        if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/embed/")[1];
      }
    } catch {}
    return null;
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: "40px auto",
      padding: "30px",
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>🎯 YouTube Comment Analyzer</h2>

      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <label>
          <input
            type="radio"
            value="url"
            checked={mode === "url"}
            onChange={() => setMode("url")}
          /> Analyze by Video URL
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            value="theme"
            checked={mode === "theme"}
            onChange={() => setMode("theme")}
          /> Analyze by Theme
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={mode === "url" ? "Enter YouTube URL" : "Enter theme or topic"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            marginBottom: "12px"
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: "10px 18px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem"
        }}>
          {loading ? "Processing..." : "Analyze"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}


      {summary && (
  <div style={{ marginTop: 30 }}>
    <h3>📊 AI Summary: Emotional and Public Opinion Insights</h3>
    {summary
      .split("\n")
      .map((line) =>
        line
          .replace(/^#+\s*/, "")     // Remove markdown headings like ## 
          .replace(/^[-*•]\s*/, "")  // Remove bullet dashes or dots
          .trim()
      )
      .filter((line) => line.length > 0)
      .map((line, idx) => {
        const isHeading =
          line.endsWith(":") &&
          /^[A-Z]/.test(line) &&
          line.split(" ").length < 12; // Heuristic: short capitalized lines ending in colon

        return (
          <p
            key={idx}
            style={{
              margin: "8px 0",
              lineHeight: "1.6em",
              fontWeight: isHeading ? "bold" : "normal",
              fontSize: isHeading ? "1.05em" : "1em",
            }}
          >
            {line}
          </p>
        );
      })}
  </div>
)}





      {keywords.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>🔑 Extracted Keywords</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: 10 }}>
            {keywords.slice(0, 30).map((kw, i) => (
              <span key={i} style={{
                background: "#eef",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.85rem"
              }}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      {mode === "theme" && videosUsed.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>🎬 Videos Analyzed</h3>
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
        </div>
      )}

      {comments.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>💬 Top Comments (showing {comments.length})</h3>
          <ul style={{ maxHeight: 300, overflowY: "auto", paddingLeft: 0 }}>
            {comments.map((c, i) => (
              <li key={i} style={{
                listStyle: "none",
                marginBottom: 14,
                paddingBottom: 8,
                borderBottom: "1px solid #ddd"
              }}>
                <p style={{ marginBottom: 4 }}>
                  <strong>@{c.username}</strong> &nbsp;
                  <span style={{ color: "#555" }}>({c.likes} likes)</span> —
                  <em style={{
                    color:
                      c.sentiment === 'positive' ? 'green' :
                      c.sentiment === 'negative' ? 'red' : '#555'
                  }}>
                    &nbsp;{c.sentiment}
                  </em>
                </p>
                <p style={{ margin: 0 }}>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
