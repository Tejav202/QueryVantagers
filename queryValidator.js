const blockedKeywords = ["delete", "drop", "remove", "update", "replace"];

function validateQuery(query) {
  const lowerQuery = query.toLowerCase();
  for (let word of blockedKeywords) {
    if (lowerQuery.includes(word)) {
      return { valid: false, message: "Unsafe query detected" };
    }
  }
  return { valid: true, message: "Query is safe" };
}

module.exports = { validateQuery };