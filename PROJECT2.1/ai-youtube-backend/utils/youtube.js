const axios = require("axios");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const fetchCommentsByVideoId = async (videoId) => {
  const comments = [];
  let nextPageToken = "";
  let count = 0;

  while (count < 500) {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          part: "snippet",
          videoId,
          key: YOUTUBE_API_KEY,
          maxResults: 100,
          pageToken: nextPageToken,
          textFormat: "plainText",
          order: "relevance", // 👈 Top comments first
        },
      }
    );

    const items = res.data.items.map((item) => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {
        username: snippet.authorDisplayName,
        text: snippet.textDisplay,
        likes: snippet.likeCount,
      };
    });

    comments.push(...items);
    nextPageToken = res.data.nextPageToken;
    count = comments.length;

    if (!nextPageToken) break;
  }

  return comments.slice(0, 500);
};

const searchVideosByTheme = async (theme) => {
  const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      key: YOUTUBE_API_KEY,
      part: "snippet",
      q: theme,
      maxResults: 5,
      type: "video",
      order: "relevance", // ✅ makes the intent explicit
      safeSearch: "none", // optional: can use "moderate" or "strict"
    },
  });

  return res.data.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
  }));
};

module.exports = { fetchCommentsByVideoId, searchVideosByTheme };
