const keyword_extractor = require("keyword-extractor");

const extractKeywords = (text) => {
  return keyword_extractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
};

module.exports = { extractKeywords };
