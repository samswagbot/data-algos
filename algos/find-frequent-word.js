/**
 * Give an array of objects contain passing and failing scores,
 * find the most frequent word among the passing test and the failing tests.
 * Print the word and the occurrences to the console
 * Note: you should omit articles or common words.
 */

const data = require("../data/student-data");

const scores = {
  passing: {},
  failing: {},
};

const removeBlockQuotes = (text, endQuoteTag) => {
  let blockquotePosition = text.lastIndexOf(endQuoteTag) + endQuoteTag.length;
  return text.slice(blockquotePosition, text.length);
};

const cleanUp = (text) => {
  return (
    text
      .toLowerCase()
      .replace(/[\.,-?\/#!$%\^&\*;:{}=\-_`~()>""''\n|\r]/g, "")
      // removes unicode
      .replace(/[^\x00-\x7F]/g, "")
      .trim()
      .split(" ")
  );
};

const sanitizeWords = (text) => {
  const endQuoteTag = "</blockquote>";
  return cleanUp(
    text.includes(endQuoteTag) ? removeBlockQuotes(text, endQuoteTag) : text
  );
};

const removeArticles = (words) => {
  return words.filter(
    (word) =>
      word !== "a" &&
      word !== "an" &&
      word !== "the" &&
      word !== "is" &&
      word !== "of" &&
      word !== "all" &&
      word !== "to" &&
      word !== "in" &&
      word !== "that"
  );
};

const buildScores = (typeOfScores, word) => {
  if (scores[typeOfScores][word]) {
    scores[typeOfScores][word] = scores[typeOfScores][word] + 1;
  } else {
    scores[typeOfScores][word] = 1;
  }
};

const sortScores = (typeOfScores) => {
  return Object.entries(scores[typeOfScores]).sort((a, b) => {
    return b[1] - a[1];
  });
};

data.forEach(({ percent_correct, text }) => {
  const sanitizedWords = sanitizeWords(text);
  const omitArticles = removeArticles(sanitizedWords);
  omitArticles.forEach((word) => {
    if (percent_correct > 0.5) {
      buildScores("passing", word);
    } else {
      buildScores("failing", word);
    }
  });
});

const passingScores = sortScores("passing");
const failingScores = sortScores("failing");

module.exports = {
  failingScores: `The word most frequent in failing scores were ${failingScores[0][0]}, which occurred ${failingScores[0][1]} times`,
  passingScores: `The word most frequent in passing scores were ${passingScores[0][0]}, which occurred ${passingScores[0][1]} times`,
};
