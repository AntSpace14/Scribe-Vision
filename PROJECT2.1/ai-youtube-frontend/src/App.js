// src/App.js
import React, { useState } from "react";
import axios from "axios";
import { LoaderCircle, Youtube, Lightbulb } from "lucide-react";
import { AnimatedGridPattern } from "./components/magicui/AnimatedGridPattern";
import KeywordTag from "./components/KeywordTag";
import CommentCard from "./components/CommentCard";
import SummaryCard from "./components/SummaryCard";
import { AvatarCircles } from "./components/magicui/avatar-circles";
import { TypingAnimation } from "./components/magicui/typing-animation";

// 👇 Fallback to localhost if .env doesn't define REACT_APP_BACKEND_URL
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

  const avatars = [
    {
      imageUrl:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      profileUrl: "https://github.com/AntSpace14",
    },
  ];

  const extractVideoId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
      if (parsed.hostname.includes("youtube.com")) {
        if (parsed.searchParams.has("v")) return parsed.searchParams.get("v");
        if (parsed.pathname.startsWith("/embed/"))
          return parsed.pathname.split("/embed/")[1];
        if (parsed.pathname.startsWith("/shorts/"))
          return parsed.pathname.split("/shorts/")[1];
      }
    } catch {}
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setComments([]);
    setSummary("");
    setKeywords([]);
    setVideosUsed([]);

    const endpoint = mode === "url" ? "url" : "theme";
    const payload =
      mode === "url" ? { videoId: extractVideoId(input) } : { theme: input };

    if (mode === "url" && !payload.videoId) {
      setError("Invalid YouTube URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/comments/${endpoint}`,
        payload
      );
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-900">
      {/* Avatar circle */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50 scale-75 sm:scale-90">
        <AvatarCircles numPeople={0} avatarUrls={avatars} />
      </div>

      <AnimatedGridPattern className="z-0" />

      <div className="relative z-10 max-w-5xl mx-auto p-6 sm:p-10 font-sans">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
            <Youtube className="text-red-500 w-7 h-7" />
            <TypingAnimation>Scribe-Vision</TypingAnimation>
          </h1>
          <p className="text-md text-gray-500 mt-1">
            A YouTube Comment Analyzer for Writers
          </p>
        </header>

        {/* About Card */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-white/80 p-6 sm:p-8 md:p-10 shadow-lg backdrop-blur-md hover:shadow-2xl animate-fade-in-up">
          <div className="absolute -inset-8 -z-10 rounded-[inherit] bg-gradient-to-br from-transparent via-blue-100 to-transparent opacity-30 blur-2xl animate-pulse"></div>
          <div className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-radial from-black/5 via-transparent to-transparent blur-xl"></div>

          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4 drop-shadow-sm">
            <span className="animate-lightbulb-pulse">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
            </span>
            What is Scribe-Vision?
          </h2>

          <p className="text-gray-700 text-md mb-4 leading-relaxed">
            <strong className="text-blue-600">Scribe-Vision</strong> analyzes
            YouTube comments using
            <strong className="text-purple-600"> Mistral AI</strong> and the
            <strong className="text-red-500"> YouTube Data API</strong> to
            uncover public opinion, emotion, and keywords — perfect for writers
            seeking inspiration.
          </p>

          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 pl-1">
            <li>
              <strong>URL mode</strong>: Paste a YouTube video link
            </li>
            <li>
              <strong>Theme mode</strong>: Enter a topic (e.g., “loneliness in
              cinema”)
            </li>
          </ul>
        </div>

        {/* Dots bounce */}
        <div className="flex justify-center my-10 space-x-2">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75" />
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150" />
          <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce delay-300" />
        </div>

        {/* Mode Switch */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              mode === "url"
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            🔗 By URL
          </button>
          <button
            type="button"
            onClick={() => setMode("theme")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              mode === "theme"
                ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            🎯 By Theme
          </button>
        </div>

        {/* Input + Submit */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            placeholder={
              mode === "url" ? "Enter YouTube URL" : "Enter theme or keyword"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-sm sm:text-base 
              bg-white/90 text-gray-800 placeholder-gray-400 
              border border-gray-200 shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-300 
              transition duration-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin w-4 h-4" />
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {summary && <SummaryCard summary={summary} />}

        {keywords.length > 0 && (
          <div className="mt-12 animate-fade-in-up">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              🔑 Top <span className="text-indigo-600">Keywords</span>
            </h3>
            <div className="flex flex-wrap gap-2 bg-gray-50/70 border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)]">
              {keywords.slice(0, 30).map((kw, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 40}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <KeywordTag keyword={kw} />
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "theme" && videosUsed.length > 0 && (
          <div className="mt-12 animate-fade-in-up">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              🎬 Videos <span className="text-blue-600">Analyzed</span>
            </h3>
            <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)] space-y-2">
              {videosUsed.map((vid, i) => (
                <a
                  key={i}
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-700 hover:text-blue-900 transition-colors text-sm sm:text-base font-medium animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  • {vid.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {comments.length > 0 && (
          <div className="mt-12 animate-fade-in-up">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
              💬 Top <span className="text-indigo-600">Comments</span>
            </h3>
            <div className="space-y-5 max-h-[450px] overflow-y-auto pr-1 sm:pr-2">
              {comments.map((c, i) => (
                <CommentCard key={i} comment={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
