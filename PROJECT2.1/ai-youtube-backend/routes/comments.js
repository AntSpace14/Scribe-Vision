const express = require("express");
const router = express.Router();
const { fetchCommentsByVideoId, searchVideosByTheme } = require("../utils/youtube");
const { analyzeSentiments } = require("../utils/sentiment");
const { extractKeywords } = require("../utils/keywords");
const { summarizeComments } = require("../utils/summarizer");

// Analyze by URL
router.post("/url", async (req, res) => {
  try {
    const { videoId } = req.body;
    const comments = await fetchCommentsByVideoId(videoId);
    const sentimentResults = analyzeSentiments(comments);
    const summary = await summarizeComments(comments.map(c => c.text));
    const keywords = extractKeywords(comments.map(c => c.text).join(" "));
    res.json({ comments: sentimentResults, summary, keywords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process video ID" });
  }
});

// Analyze by theme
router.post("/theme", async (req, res) => {
  try {
    const { theme } = req.body;
    const videoResults = await searchVideosByTheme(theme); // Now returns array of { videoId, title }
    const allComments = [];
    const videosUsed = [];

    for (const { videoId, title } of videoResults) {
      const comments = await fetchCommentsByVideoId(videoId);
      if (comments.length > 0) {
        allComments.push(...comments);
        videosUsed.push({
          title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }

    const sentimentResults = analyzeSentiments(allComments);
    const summary = await summarizeComments(allComments.map(c => c.text));
    const keywords = extractKeywords(allComments.map(c => c.text).join(" ")).slice(0, 30);

    res.json({ comments: sentimentResults, summary, keywords, videosUsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process theme" });
  }
});



module.exports = router;
