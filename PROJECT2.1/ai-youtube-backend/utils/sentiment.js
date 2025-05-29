const vader = require("vader-sentiment");

const analyzeSentiments = (comments) => {
  return comments.map(comment => {
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(comment.text);
    let sentiment = "neutral";
    if (intensity.compound > 0.3) sentiment = "positive";
    else if (intensity.compound < -0.3) sentiment = "negative";

    return {
      ...comment,
      sentiment,
      score: intensity.compound,
    };
  });
};

module.exports = { analyzeSentiments };
